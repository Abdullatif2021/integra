import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {GoogleApiService} from '../service/google.api.service';

@Injectable()
export class GoogleScriptResolver implements Resolve<any> {

    constructor(private googleApiService: GoogleApiService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise(async (resolve) => {
            resolve(await this.googleApiService.loadApiScripts());
        });
    }

}
