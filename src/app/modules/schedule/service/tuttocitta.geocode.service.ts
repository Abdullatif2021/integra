import { Injectable } from '@angular/core';
import {StreetInterface} from '../../../core/models/street.interface';
import {LocatedStreetInterface} from '../../../core/models/located-street.interface';
import {TuttocittaGeocodeResponceInterface} from '../../../core/models/tuttocitta-geocode-responce.interface';
import {LocatedRecipientInterface, RecipientLocationInterface} from '../../../core/models/recipient.interface';

@Injectable()
export class TuttocittaGeocodeService {

    constructor() { }

    sendGeocodeRequest(recipient: RecipientLocationInterface): Promise<TuttocittaGeocodeResponceInterface> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callback = '__tuttocitta_result = ' ;
            const address = `${recipient.street}, ${recipient.houseNumber}, ${recipient.cap} ${recipient.city}`;
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

    locate(recipient: RecipientLocationInterface): Promise<LocatedRecipientInterface> {
        return new Promise<LocatedRecipientInterface>(async (resolve) => {

            const tRes = await this.sendGeocodeRequest(recipient) ;
            if (tRes.t === '' || typeof tRes.r[0] === 'undefined' || typeof tRes.r[0].topo === 'undefined')  {
                return resolve(null) ;
            }
            let res ;
            tRes.r.forEach((elm) => {
               if (elm.cap === recipient.cap && elm.topo !== '') {
                   res = elm ;
               }
            });
            if (!res) {
                return resolve(null);
            }
            return resolve({
                id: recipient.id,
                lat: res.lat,
                long: res.lon,
                is_fixed: true,
                name: res.topo.split(',')[0],
            });

        });
    }


}
