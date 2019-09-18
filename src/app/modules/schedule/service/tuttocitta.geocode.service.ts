import { Injectable } from '@angular/core';
import {StreetInterface} from '../../../core/models/street.interface';
import {LocatedStreetInterface} from '../../../core/models/located-street.interface';
import {TuttocittaGeocodeResponceInterface} from '../../../core/models/tuttocitta-geocode-responce.interface';

@Injectable()
export class TuttocittaGeocodeService {

    constructor() { }

    sendGeocodeRequest(street: StreetInterface): Promise<TuttocittaGeocodeResponceInterface> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callback = '__tuttocitta_result = ' ;
            const address = `${street.name} - ${street.cap.name} ${street.city.name}`;
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

    locate(street: StreetInterface): Promise<LocatedStreetInterface> {
        return new Promise<LocatedStreetInterface>(async (resolve) => {

            const tRes = await this.sendGeocodeRequest(street) ;
            if (tRes.t === '' || typeof tRes.r[0] === 'undefined' || typeof tRes.r[0].topo === 'undefined')  {
                return resolve(null) ;
            }
            let res ;
            tRes.r.forEach((elm) => {
               if (elm.cap === street.cap.name && elm.topo !== '') {
                   res = elm ;
               }
            });
            if (!res) {
                return resolve(null);
            }
            return resolve({
                id: street.id,
                name: res.topo.split(',')[0],
                lat: res.lat,
                long: res.lon
            });

        });
    }


}
