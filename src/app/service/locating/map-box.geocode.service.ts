import { Injectable } from '@angular/core';
import {MapBoxGeocodeResponceInterface} from '../../core/models/map-box-geocode-responce.interface';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SettingsService} from '../settings.service';
import {LocatedBuildingInterface, BuildingLocationInterface} from '../../core/models/building.interface';
import {StreetLocationInterface} from '../../core/models/street.location.interface';
import {LocatedStreetInterface} from '../../core/models/located-street.interface';

@Injectable()
export class MapBoxGeocodeService {

    constructor(
        private http: HttpClient,
        private settingsService: SettingsService
    ) {}

    keys ;
    key_at = 0 ;
    invalid_keys_alerted = false ;

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('mapbox').then((data) => {
                this.keys = data.length ? data : [{name: ''}] ;
                resolve(true);
            });
        });
    }

    sendGeocodeRequest(building: BuildingLocationInterface): Observable<MapBoxGeocodeResponceInterface> {
        const options = { params: new HttpParams(),  headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        const houseNumber = building.houseNumber ? building.houseNumber : '1' ;
        options.params = options.params.set('postcode', building.cap);
        options.params = options.params.set('place', building.city);
        options.params = options.params.set('address', houseNumber);
        options.params = options.params.set('access_token', this.keys[this.key_at].name) ;
        return this.http.get<MapBoxGeocodeResponceInterface>
        (`https://api.mapbox.com/geocoding/v5/mapbox.places/${building.street.replace('\\', '')}.json`, options);

    }

    sendStreetGeocodeRequest(street: StreetLocationInterface): Observable<MapBoxGeocodeResponceInterface> {
        const options = { params: new HttpParams(),  headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        const address = `${street.address}, 1`;
        options.params = options.params.set('address', address);
        options.params = options.params.set('access_token', this.keys[this.key_at].name) ;
        return this.http.get<MapBoxGeocodeResponceInterface>
        (`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json`, options);
    }

    locate(building: BuildingLocationInterface): Promise<LocatedBuildingInterface> {
        return new Promise<LocatedBuildingInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }

            let error = null ;
            const mRes = await this.sendGeocodeRequest(building).toPromise().catch(async (e) => {
                if (e.statusText === 'Unauthorized' && !this.invalid_keys_alerted) {
                    error = 'Unauthorized';
                }
            });

            if (!mRes || !mRes.features.length) {
                if (error === 'Unauthorized' && this.key_at < this.keys.length) {
                    this.key_at++ ;
                    return resolve(await this.locate(building));
                } else if (error === 'Unauthorized') {
                    this.handleExpiredToken();
                }
                return resolve(null) ;
            }
            let res ;
            mRes.features.forEach((elm) => {
                if (elm.place_name.indexOf(building.cap) !== -1  &&
                    elm.place_name.toLocaleLowerCase().indexOf(building.city.toLocaleLowerCase()) !== -1) {
                    res = elm ;
                }
            });
            if (!res) {
                return resolve(null);
            }
            return resolve({
                id: building.id,
                lat: res.center[1],
                long: res.center[0],
                is_fixed: true,
                name: res.place_name.split(',')[0],
            });

        });
    }

    locateStreet(street: StreetLocationInterface): Promise<LocatedStreetInterface> {
        return new Promise<LocatedStreetInterface>(async (resolve) => {
            if (this.invalid_keys_alerted) { return resolve(null); }
            if (!this.keys) { await this.loadKeys(); }

            let error = null;
            const mRes = await this.sendStreetGeocodeRequest(street).toPromise().catch((e) => {
                if (e.statusText === 'Unauthorized' && !this.invalid_keys_alerted) {
                    error = 'Unauthorized';
                }
            });
            if (!mRes || !mRes.features.length) {
                return resolve(null) ;
            }

            const res = mRes[0];
            if (!res) {
                if (error === 'Unauthorized' && this.key_at < this.keys.length) {
                    this.key_at++ ;
                    return resolve(await this.locateStreet(street));
                } else if (error === 'Unauthorized') {
                    this.handleExpiredToken();
                }
                return resolve(null);
            }
            return resolve({
                id: street.id,
                lat: res.center[1],
                long: res.center[0],
                isFixed: true,
                fixedName: res.place_name.split(',')[0],
            });

        });
    }

    handleExpiredToken() {
        if (!this.invalid_keys_alerted) {
            alert('Mapbox Keys are invalid, this provider will be ignored') ;
            this.invalid_keys_alerted = true;
        }
    }
}
