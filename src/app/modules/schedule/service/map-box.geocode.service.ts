import { Injectable } from '@angular/core';
import {StreetInterface} from '../../../core/models/street.interface';
import {LocatedStreetInterface} from '../../../core/models/located-street.interface';
import {MapBoxGeocodeResponceInterface} from '../../../core/models/map-box-geocode-responce.interface';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SettingsService} from '../../../service/settings.service';
import {LocatedRecipientInterface, RecipientLocationInterface} from '../../../core/models/recipient.interface';

@Injectable()
export class MapBoxGeocodeService {

    constructor(
        private http: HttpClient,
        private settingsService: SettingsService
    ) {}

    keys ;
    invalid_keys_alerted = false ;

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('mapbox').then((data) => {
                this.keys = data.length ? data : [{name: ''}] ;
                resolve(true);
            });
        });
    }

    sendGeocodeRequest(recipient: RecipientLocationInterface): Observable<MapBoxGeocodeResponceInterface> {
        const options = { params: new HttpParams()};
        options.params = options.params.set('postcode', recipient.cap);
        options.params = options.params.set('place', recipient.city);
        options.params = options.params.set('address', recipient.houseNumber);
        options.params = options.params.set('access_token', this.keys[0].name) ;
        return this.http.get<MapBoxGeocodeResponceInterface>
        (`https://api.mapbox.com/geocoding/v5/mapbox.places/${recipient.street.replace('\\', '')}.json`, options);

    }

    locate(recipient: RecipientLocationInterface): Promise<LocatedRecipientInterface> {
        return new Promise<LocatedRecipientInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }
            const mRes = await this.sendGeocodeRequest(recipient).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized' && !this.invalid_keys_alerted) {
                    alert('MapBox Keys are invalid, this provider will be ignored') ;
                    this.invalid_keys_alerted = true ;
                    resolve(null);
                }
            });
            if (!mRes || !mRes.features.length) {
                return resolve(null) ;
            }
            let res ;
            mRes.features.forEach((elm) => {
                if (elm.place_name.indexOf(recipient.cap) !== -1  &&
                    elm.place_name.toLocaleLowerCase().indexOf(recipient.city.toLocaleLowerCase()) !== -1) {
                    res = elm ;
                }
            });
            if (!res) {
                return resolve(null);
            }
            return resolve({
                id: recipient.id,
                lat: res.center[0],
                long: res.center[1],
                is_fixed: true,
                name: res.place_name.split(',')[0],
            });

        });
    }


}
