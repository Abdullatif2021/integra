import { Injectable } from '@angular/core';
import {StreetInterface} from '../../../core/models/street.interface';
import {LocatedStreetInterface} from '../../../core/models/located-street.interface';
import {TuttocittaGeocodeResponceInterface} from '../../../core/models/tuttocitta-geocode-responce.interface';
import {LocatedRecipientInterface, RecipientLocationInterface} from '../../../core/models/recipient.interface';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {AppConfig} from '../../../config/app.config';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';

@Injectable()
export class AddressesActionsService {

    constructor(private http: HttpClient,) { }

    renameCity(city, preDispatch, name) {
        const options = {
            name: name,
            city_id: city,
            pre_dispatch_id: preDispatch
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.updateCityName, options).pipe(
            catchError(this.handleError)
        );
    }

    renameStreet(city, preDispatch, cap, street,  name) {
        const options = {
            new_name: name,
            city_id: city,
            pre_dispatch_id: preDispatch,
            cap_id: cap,
            street_id: street,
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.updateStreetName, options).pipe(
            catchError(this.handleError)
        );
    }


    getAllStartPoints() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAllStartPoints).pipe(
            catchError(this.handleError)
        );
    }

    updatePoreDispatchStartPoint(preDispatch, startPoint) {
        const options = {
            id: preDispatch,
            start_id: startPoint,
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.updatePreDispatchStartPoint, options).pipe(
            catchError(this.handleError)
        );
    }
    getAllEndPoints() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAllEndPoints).pipe(
            catchError(this.handleError)
        );
    }

    updatePoreDispatchEndPoint(preDispatch, endPoint) {
        const options = {
            id: preDispatch,
            end_id: endPoint,
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.updatePreDispatchEndPoint, options).pipe(
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
