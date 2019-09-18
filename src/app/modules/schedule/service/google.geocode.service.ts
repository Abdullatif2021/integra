import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GoogleGeocodeResponseInterface} from '../../../core/models/google-geocode-responce.interface';
import {StreetInterface} from '../../../core/models/street.interface';
import {LocatedStreetInterface} from '../../../core/models/located-street.interface';
import {SettingsService} from '../../../service/settings.service';

@Injectable()
export class GoogleGeocodeService {

    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    invalid_keys_alerted = false ;

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('google_maps').then((data) => {
                this.keys = data.length ? data : [{name: ''}] ;
                resolve(true);
            });
        });
    }

    sendGeocodeRequest(street: StreetInterface): Observable<GoogleGeocodeResponseInterface> {
        const options = { params: new HttpParams()};
        options.params = options.params.set('address', `${street.name} - ${street.cap.name} ${street.city.name}`) ;
        options.params = options.params.set('key', this.keys[0].name) ;
        return this.http.get<GoogleGeocodeResponseInterface>('https://maps.googleapis.com/maps/api/geocode/json', options);
    }

    locate(street: StreetInterface): Promise<LocatedStreetInterface> {
        return new Promise<LocatedStreetInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }
            const gRes = await this.sendGeocodeRequest(street).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized' && !this.invalid_keys_alerted) {
                    alert('Google Maps Keys are invalid, this provider will be ignored') ;
                    this.invalid_keys_alerted = true;
                }
            });
            if (!gRes || gRes.status !== 'OK' || gRes.results[0].types.indexOf('route') === -1) {
                return resolve(null) ;
            }
            return resolve({
                id: street.id,
                name: gRes.results[0].formatted_address.split(',')[0],
                lat: gRes.results[0].geometry.location.lat,
                long: gRes.results[0].geometry.location.lng
            });
        });
    }


}
