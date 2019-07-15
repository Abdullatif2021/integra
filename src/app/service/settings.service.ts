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

    getProviders() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getProvider).pipe(
            catchError(this.handleError)
        );
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

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        return throwError('');
    }
}
