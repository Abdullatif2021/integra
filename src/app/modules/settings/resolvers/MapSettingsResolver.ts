import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SettingsService} from '../../../service/settings.service';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapSettingsResolver implements Resolve<ApiResponseInterface> {
    constructor(private settingsService: SettingsService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ApiResponseInterface> {
        return this.settingsService.getProviderKeys(route.params.provider);
    }
}