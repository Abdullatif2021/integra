import { Injectable } from '@angular/core';
import {TuttocittaGeocodeResponceInterface} from '../../../core/models/tuttocitta-geocode-responce.interface';
import {LocatedBuildingInterface, BuildingLocationInterface} from '../../../core/models/building.interface';

@Injectable()
export class TuttocittaGeocodeService {

    constructor() { }

    sendGeocodeRequest(building: BuildingLocationInterface): Promise<TuttocittaGeocodeResponceInterface> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const houseNumber = building.houseNumber ? building.houseNumber : 1 ;
            const callback = '__tuttocitta_result = ' ;
            const address = `${building.street}, ${houseNumber}, ${building.cap} ${building.city}`;
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

    locate(building: BuildingLocationInterface): Promise<LocatedBuildingInterface> {
        return new Promise<LocatedBuildingInterface>(async (resolve) => {

            const tRes = await this.sendGeocodeRequest(building) ;
            if (tRes.t === '' || typeof tRes.r[0] === 'undefined' || typeof tRes.r[0].topo === 'undefined')  {
                return resolve(null) ;
            }
            let res: any = {};
            tRes.r.forEach((elm) => {
               if (elm.cap === building.cap && elm.topo !== '') {
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


}
