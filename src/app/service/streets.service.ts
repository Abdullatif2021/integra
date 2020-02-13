import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {FiltersService} from './filters.service';

@Injectable({
  providedIn: 'root'
})
export class StreetsService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        ) { }

    getStreets(page, rpp, name, cities, order, citiesType) {
        const options = { params: new HttpParams().set('page', page).set('pageSize', rpp)};
        if (order) {
            options.params = options.params.set('orderMethod', order);
        }
        if (name !== null) { options.params = options.params.set('streetName', name); }
        if (cities.all) {
            if (cities.items.length) {
                if (citiesType === 'by_client') {
                    options.params = options.params.set('exclude_clients_ids', cities.items);
                } else {
                    options.params = options.params.set('exclude_cities_ids', cities.items);
                }
            }
            if (cities.search) {
                options.params = options.params.set('bySearch', cities.search);
            }
        } else {
            if (cities.items.length) {
                if (citiesType === 'by_client') {
                    options.params = options.params.set('clients', cities.items);
                } else {
                    options.params = options.params.set('cities_ids', cities.items);
                }
            }
        }
        if (citiesType === 'by_client') {
            options.params = options.params.set('by_clients_Filter', '1');
        }
        options.params = this.filtersService.getHttpParams(options.params) ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getStreet, options).pipe(
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
