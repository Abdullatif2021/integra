import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/index';
import { AppConfig } from '../config/app.config';
import {ApiResponseInterface} from '../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})

export class CitiesService {

    constructor(private http: HttpClient) { }

    getCities(page, rpp, name) {
        const options = { params: new HttpParams().set('page', page).set('pageSize', rpp)};
        if (name !== null) { console.log('here'); options.params = options.params.set('cityName', name); }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCities, options).pipe(
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
