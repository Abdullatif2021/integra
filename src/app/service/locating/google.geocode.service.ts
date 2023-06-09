import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocatedBuildingInterface, BuildingLocationInterface, FormattedAddress } from '../../core/models/building.interface';
import {GoogleGeocodeResponseInterface} from '../../core/models/google-geocode-responce.interface';
import {SettingsService} from '../settings.service';
import {LocatedStreetInterface} from '../../core/models/located-street.interface';
import {StreetLocationInterface} from '../../core/models/street.location.interface';

@Injectable()
export class GoogleGeocodeService {

    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    key_at = 0 ;
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
        options.params = options.params.set('address', `${building.validAddress.indirizzo}, ${building.validAddress.civico}` ) ;
        options.params = options.params.set('components', 'postal_code:' + building.cap) ;
        options.params = options.params.set('key', this.keys[this.key_at].name) ;
        return this.http.get<GoogleGeocodeResponseInterface>('https://maps.googleapis.com/maps/api/geocode/json', options);
    }

    sendStreetGeocodeRequest(street: StreetLocationInterface): Observable<GoogleGeocodeResponseInterface> {
        const options = { params: new HttpParams(),  headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        options.params = options.params.set('address', `${street.address}, 1`) ;
        options.params = options.params.set('key', this.keys[0].name) ;
        return this.http.get<GoogleGeocodeResponseInterface>('https://maps.googleapis.com/maps/api/geocode/json', options);
    }

    locate(building: BuildingLocationInterface): Promise<LocatedBuildingInterface> {
        return new Promise<LocatedBuildingInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }

            let error = null ;
            const gRes = <GoogleGeocodeResponseInterface> await this.sendGeocodeRequest(building).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized') { error = 'REQUEST_DENIED'; }
            });
            if (!gRes || gRes.status !== 'OK' || error === 'REQUEST_DENIED') {
                if (gRes.status === 'REQUEST_DENIED') {
                    if (this.key_at < this.keys.length ) {
                        this.key_at++ ;
                        return resolve(await this.locate(building));
                    }
                    this.handleExpiredToken();
                }
                return resolve(null) ;
            }
            const address_component = gRes.results[0].address_components;
            let _b = false ;
            for (let i = 0; i < address_component.length; ++i) {
                if (address_component[i].types.indexOf('street_number') !== -1) {
                    _b = true ;
                    if (building.houseNumber !== address_component[i].long_name) {
                        return resolve(null);
                    }
                }
            }
            if (!_b) { return resolve(null); }
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

        if (!address.results[0].address_components) {
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

    locateStreet(street) {
        return new Promise<LocatedStreetInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }

            let error = null ;
            const gRes = <GoogleGeocodeResponseInterface> await this.sendStreetGeocodeRequest(street).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized') {
                    error = 'REQUEST_DENIED';
                }
            });
            if (!gRes || gRes.status !== 'OK') {
                if (gRes.status === 'REQUEST_DENIED' || error === 'REQUEST_DENIED') {
                    this.handleExpiredToken();
                }
                return resolve(null) ;
            }
            const address = this.getAddressObject(gRes) ;
            if (!address.street) {
                return resolve(null);
            }
            return resolve({
                id: street.id,
                original_address: street.address,
                lat: gRes.results[0].geometry.location.lat,
                long: gRes.results[0].geometry.location.lng,
                isFixed: true,
                fixedName: address.street,
            });
        });
    }
}
