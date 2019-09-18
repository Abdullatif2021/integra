import { Injectable } from '@angular/core';
import {AppConfig} from '../config/app.config';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

    constructor(private http: HttpClient) { }
    providersKeys ;

    getProviders() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getProvider).pipe(
            catchError(this.handleError)
        );
    }

    async getMapProviderKey(provider): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            if (typeof this.providersKeys !== 'undefined') {
                return resolve(typeof this.providersKeys[provider] !== 'undefined' ? this.providersKeys[provider] : []);
            }
            const data = await this.http.get<any>(AppConfig.endpoints.getProviders).toPromise();
            if (typeof data[0] === 'undefined') {
                return resolve([]) ;
            }

            const mapBoxProvider = data.find((elm) => elm.name === 'Mapbox') ;
            const googleProvider = data.find((elm) => elm.name === 'Google maps') ;
            this.providersKeys = {
                google_maps: provider ? googleProvider.provider_keys : [],
                mapbox: provider ? mapBoxProvider.provider_keys : []
            }

            return resolve(typeof this.providersKeys[provider] !== 'undefined' ? this.providersKeys[provider] : []);
        });
    }

    getProviderKeys(provider) {
        const options = {params: new HttpParams().set('id', provider) } ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getProviderKeys, options).pipe(
            catchError(this.handleError)
        );
    }

    createEmpty(provider) {
        const formData = new FormData();
        formData.append('name', 'New Provider Key');
        formData.append('limit_day', '1');
        formData.append('limit_month', '1');
        formData.append('provider_id', provider);
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.createProviderKeys, formData).pipe(
            catchError(this.handleError)
        );
    }

    deleteProviderKey(providerKey) {
        const options = {
            body : { id: providerKey }
        }
        return this.http.request<ApiResponseInterface>('delete', AppConfig.endpoints.deleteProviderKeys, options).pipe(
            catchError(this.handleError)
        );
    }

    editProviderKey(providerKey, provider) {
        const options = {
            body : {
                id: providerKey.id,
                name: providerKey.name,
                limit_month: providerKey.limit_month,
                limit_day: providerKey.limit_day,
                provider_id: provider
            }
        }
        return this.http.request<ApiResponseInterface>('put', AppConfig.endpoints.editProviderKeys, options).pipe(
            catchError(this.handleError)
        );
    }

    getProductStatusType() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getProductStatusType).pipe(
            catchError(this.handleError)
        );
    }

    editProductStatusType(names) {
        const options = {
            body : {
                names: names
            }
        }
        return this.http.request<ApiResponseInterface>('put', AppConfig.endpoints.updateProductStatusType, options).pipe(
            catchError(this.handleError)
        );
    }

    getPaginationOptions() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPaginationOptions, {}).pipe(
            catchError(this.handleError)
        );
    }

    updatePaginationOptions(streets_rpp, tree_rpp) {
        const formData = new FormData();
        formData.append('get_street_pagination', streets_rpp);
        formData.append('get_tree_pagination', tree_rpp);
        return this.http.post<any>(AppConfig.endpoints.updatePaginationOptions, formData).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        return throwError('');
    }
}
