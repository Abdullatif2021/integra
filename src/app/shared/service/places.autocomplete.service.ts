import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../service/settings.service';
import {ACAddress} from '../../core/models/address.interface';
import {FormattedAddress} from '../../core/models/building.interface';

@Injectable()
export class PlacesAutocompleteService {

    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    loaded = false ;
    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('google_maps').then((data) => {
                this.keys = data.length ? data : [{name: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'}] ;
                resolve(true);
            });
        });
    }

    async loadAutoComplete(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (this.loaded) { return resolve(true); }
            if (!this.keys) { await this.loadKeys(); }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.keys[0].name}&libraries=places&language=it`;
            document.head.appendChild(script);
            script.onload = () => {
                this.loaded = true ;
                return resolve(true);
            };
            script.onerror = (error) => {
                reject(error);
                script.remove();
            };
        });
    }

    formattedAddressToObject(address: string): ACAddress {
        const address_array = address.split(',') ;
        if (address_array.length < 3) {
            return null ;
        }
        const city_cap = address_array[2].trim().split(' ');
        let cap: any = parseInt(city_cap[0], 10) ? parseInt(city_cap[0], 10) : '' ;
        if (!cap) {
            cap = '' ;
        } else {
            delete city_cap[0] ;
        }
        const city = city_cap.join(' ');

        return {
            text: address,
            hasObject: true,
            address: {
                street: address_array[0].trim(),
                houseNumber: address_array[1].trim(),
                city: city.trim(),
                cap: cap,
                strict: (address_array[0].trim() && address_array[1].trim() && city.trim() && cap) ? true : false ,
            }
        };
    }

    getAddressObject(address): FormattedAddress {
        const formattedAddress = <FormattedAddress>{
            street: '',
            city: '',
            houseNumber: '',
            cap: null,
            country: '',
        };

        if (!address.address_components) {
            return formattedAddress;
        }

        address.address_components.forEach((elm) => {
            if (elm.types.indexOf('route') !== -1) {
                formattedAddress.street = elm.long_name;
            } else if (elm.types.indexOf('locality') !== -1) {
                formattedAddress.city = elm.long_name;
            } else if (elm.types.indexOf('country') !== -1) {
                formattedAddress.country = elm.long_name;
            } else if (elm.types.indexOf('postal_code') !== -1) {
                formattedAddress.cap = elm.long_name;
            } else if (elm.types.indexOf('street_number') !== -1) {
                formattedAddress.houseNumber = elm.long_name;
            }
        });

        return formattedAddress;
    }


}
