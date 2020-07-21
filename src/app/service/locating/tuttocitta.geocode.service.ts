import { Injectable } from '@angular/core';
import {TuttocittaGeocodeResponceInterface} from '../../core/models/tuttocitta-geocode-responce.interface';
import {LocatedBuildingInterface, BuildingLocationInterface} from '../../core/models/building.interface';
import {StreetLocationInterface} from '../../core/models/street.location.interface';
import {LocatedStreetInterface} from '../../core/models/located-street.interface';

@Injectable()
export class TuttocittaGeocodeService {

    constructor() { }

    sendGeocodeRequest(building: BuildingLocationInterface): Promise<TuttocittaGeocodeResponceInterface> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const houseNumber = building.houseNumber ? building.houseNumber : 1 ;
            const callback = '__tuttocitta_result = ' ;
            // const address = `${building.city}, ${building.street}, ${houseNumber}, ${building.cap}`;
            const address = `${building.validAddress.indirizzo}, ${building.validAddress.civico}`;
            // the following line only used to remove the annoying undefined variable IDE error
            const windoo: any = window ;
            script.src = `https://services.tuttocitta.it/lbs?callback=${callback}&&sito=ac_api&&dv=${address}&format=javascript`;
            document.head.appendChild(script);
            script.onload = () => {
                resolve(windoo.__tuttocitta_result);
                script.remove();
            };
            script.onerror = (error) => {
                reject(error);
                script.remove();
            };
        });
    }

    sendStreetGeocodeRequest(street: StreetLocationInterface): Promise<TuttocittaGeocodeResponceInterface> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callback = '__tuttocitta_result = ' ;
            const windoo: any = window ;
            script.src = `https://services.tuttocitta.it/lbs?callback=${callback}&&sito=ac_api&&dv=${street.address},1&format=javascript`;
            document.head.appendChild(script);
            script.onload = () => {
                resolve(windoo.__tuttocitta_result);
                script.remove();
            };
            script.onerror = (error) => {
                reject(error);
                script.remove();
            };
        });
    }

    locate(building: BuildingLocationInterface): Promise<LocatedBuildingInterface> {
        return new Promise<LocatedBuildingInterface>(async (resolve) => {

            const tRes = await this.sendGeocodeRequest(building) ;
            if (tRes.t === '' || typeof tRes.r[0] === 'undefined' || typeof tRes.r[0].topo === 'undefined')  {
                return resolve(null) ;
            }
            let res: any = {};
            tRes.r.forEach((elm) => {
               const topo = elm.topo.split(',');
               if (elm.cap === building.cap && elm.topo !== '' &&
                   topo.length > 1 && topo[topo.length - 1].trim() === building.houseNumber) {
                   res = elm ;
               }
            });
            if (!res || typeof res.topo === 'undefined') {
                return resolve(null);
            }
            return resolve({
                id: building.id,
                lat: res.lat,
                long: res.lon,
                is_fixed: true,
                name: res.topo.split(',')[0],
            });

        });
    }

    locateStreet(street: StreetLocationInterface): Promise<LocatedStreetInterface> {
        return new Promise<LocatedStreetInterface>(async (resolve) => {

            const tRes = await this.sendStreetGeocodeRequest(street) ;
            if (tRes.t === '' || typeof tRes.r[0] === 'undefined' || typeof tRes.r[0].topo === 'undefined')  {
                return resolve(null) ;
            }
            let res: any = {};
            tRes.r.forEach((elm) => {
               const topo = elm.topo.split(',');
               if (elm.topo !== '') {
                   res = elm ;
               }
            });
            if (!res || typeof res.topo === 'undefined') {
                return resolve(null);
            }

            return resolve({
                id: street.id,
                lat: res.lat,
                long: res.lon,
                isFixed: true,
                fixedName: res.topo.split(',')[0],
            });

        });
    }


}
