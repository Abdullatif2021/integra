import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GoogleGeocodeResponseInterface} from '../../../core/models/google-geocode-responce.interface';
import {StreetInterface} from '../../../core/models/street.interface';
import {LocatedStreetInterface} from '../../../core/models/located-street.interface';
import {SettingsService} from '../../../service/settings.service';
import {LocatedRecipientInterface, RecipientLocationInterface} from '../../../core/models/recipient.interface';

@Injectable()
export class GoogleGeocodeService {

    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    invalid_keys_alerted = false ;

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('google_maps').then((data) => {
                this.keys = data.length ? data : [{name: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'}] ;
                resolve(true);
            });
        });
    }

    sendGeocodeRequest(recipient: RecipientLocationInterface): Observable<GoogleGeocodeResponseInterface> {
        const options = { params: new HttpParams()};
        options.params = options.params.set('address',
            `${recipient.street}, ${recipient.houseNumber}, ${recipient.cap} ${recipient.city}`) ;
        options.params = options.params.set('components', 'postal_code:' + recipient.cap) ;
        options.params = options.params.set('key', this.keys[0].name) ;
        return this.http.get<GoogleGeocodeResponseInterface>('https://maps.googleapis.com/maps/api/geocode/json', options);
    }

    locate(recipient: RecipientLocationInterface): Promise<LocatedRecipientInterface> {
        return new Promise<LocatedRecipientInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }
            const gRes = <GoogleGeocodeResponseInterface> await this.sendGeocodeRequest(recipient).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized') { this.handleExpiredToken(); }
            });
            if (!gRes || gRes.status !== 'OK') {
                if (gRes.status === 'REQUEST_DENIED') {
                    this.handleExpiredToken();
                }
                return resolve(null) ;
            }
            return resolve({
                id: recipient.id,
                lat: gRes.results[0].geometry.location.lat,
                long: gRes.results[0].geometry.location.lng,
                is_fixed: true,
                name: gRes.results[0].formatted_address.split(',')[0],
            });
        });
    }

    handleExpiredToken(){
        if (!this.invalid_keys_alerted) {
            alert('Google Maps Keys are invalid, this provider will be ignored') ;
            this.invalid_keys_alerted = true;
        }
    }


}
