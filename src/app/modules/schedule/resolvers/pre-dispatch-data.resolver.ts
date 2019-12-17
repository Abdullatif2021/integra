import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {PlacesAutocompleteService} from '../../../shared/service/places.autocomplete.service';

@Injectable()
export class PreDispatchDataResolver implements Resolve<any> {

    constructor(
        private preDispatchService: PreDispatchService,
        private placesAutocompleteService: PlacesAutocompleteService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise(async (resolve, reject) => {
            await this.placesAutocompleteService.loadAutoComplete();
            this.preDispatchService.getPreDispatchData(route.paramMap.get('id')).subscribe(
                res => {
                    if (!res.success) {
                        reject({msg: res.message}) ;
                    }
                    resolve(res.data);
                },
                error => {
                    reject(error);
                }
            );
        });
    }




}
