import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocatedBuildingInterface, BuildingLocationInterface, FormattedAddress } from '../../core/models/building.interface';
import {GoogleGeocodeResponseInterface} from '../../core/models/google-geocode-responce.interface';
import {SettingsService} from '../settings.service';

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

    sendGeocodeRequest(building: BuildingLocationInterface): Observable<GoogleGeocodeResponseInterface> {
        const options = { params: new HttpParams(),  headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        const houseNumber = building.houseNumber ? building.houseNumber : 1 ;
        options.params = options.params.set('address',
            `${building.street}, ${houseNumber}, ${building.cap} ${building.city}`) ;
        options.params = options.params.set('components', 'postal_code:' + building.cap) ;
        options.params = options.params.set('key', this.keys[0].name) ;
        return this.http.get<GoogleGeocodeResponseInterface>('https://maps.googleapis.com/maps/api/geocode/json', options);
    }

    locate(building: BuildingLocationInterface): Promise<LocatedBuildingInterface> {
        return new Promise<LocatedBuildingInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }
            const gRes = <GoogleGeocodeResponseInterface> await this.sendGeocodeRequest(building).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized') { this.handleExpiredToken(); }
            });
            if (!gRes || gRes.status !== 'OK') {
                if (gRes.status === 'REQUEST_DENIED') {
                    this.handleExpiredToken();
                }
                return resolve(null) ;
            }

            const address = this.getAddressObject(gRes) ;
            return resolve({
                id: building.id,
                lat: gRes.results[0].geometry.location.lat,
                long: gRes.results[0].geometry.location.lng,
                is_fixed: true,
                name: address.street,
                formattedAddress: address
            });
        });
    }


    getAddressObject(address): FormattedAddress {

        const formattedAddress = <FormattedAddress>{
          street: '',
          city: '',
          houseNumber: '',
          cap: null,
          country: '',
        };

        if (!address.results[0].address_components){
            return formattedAddress;
        }

        address.results[0].address_components.forEach((elm) => {
            if (elm.types.indexOf('route') !== -1) {
                formattedAddress.street = elm.long_name ;
            } else if (elm.types.indexOf('locality') !== -1) {
                formattedAddress.city = elm.long_name ;
            } else if (elm.types.indexOf('country') !== -1) {
                formattedAddress.country = elm.long_name ;
            } else if (elm.types.indexOf('postal_code') !== -1) {
                formattedAddress.cap = elm.long_name ;
            } else if (elm.types.indexOf('street_number') !== -1) {
                formattedAddress.houseNumber = elm.long_name ;
            }
        });

        return formattedAddress ;
    }

    handleExpiredToken() {
        if (!this.invalid_keys_alerted) {
            alert('Google Maps Keys are invalid, this provider will be ignored') ;
            this.invalid_keys_alerted = true;
        }
    }


}
