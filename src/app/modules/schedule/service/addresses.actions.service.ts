import { Injectable } from '@angular/core';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {AppConfig} from '../../../config/app.config';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {ACAddress} from '../../../core/models/address.interface';

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

    updatePreDispatchStartPoint(preDispatch, startPoint) {
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
            id: parseInt(preDispatch, 10),
            end_id: endPoint,
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.updatePreDispatchEndPoint, options).pipe(
            catchError(this.handleError)
        );
    }

    createStartPoint(startPoint: ACAddress) {
        const options = {
            lat: startPoint.address.lat,
            long: startPoint.address.lng,
            text: startPoint.text
        };
        return this.http.post<any>(AppConfig.endpoints.createStartPoint, options).pipe(
            catchError(this.handleError)
        );
    }

    createEndPoint(startPoint: ACAddress) {
        const options = {
            lat: startPoint.address.lat,
            long: startPoint.address.lng,
            text: startPoint.text
        };
        return this.http.post<any>(AppConfig.endpoints.createEndPoint, options).pipe(
            catchError(this.handleError)
        );
    }

    editStartPoint(startPoint: ACAddress, id) {
        const options = {
            lat: startPoint.address.lat,
            long: startPoint.address.lng,
            text: startPoint.text,
            start_id: id
        };
        return this.http.post<any>(AppConfig.endpoints.editStartPoint, options).pipe(
            catchError(this.handleError)
        );
    }

    editEndPoint(endPoint: ACAddress, id) {
        const options = {
            lat: endPoint.address.lat,
            long: endPoint.address.lng,
            text: endPoint.text,
            end_id: id
        };
        return this.http.post<any>(AppConfig.endpoints.editEndPoint, options).pipe(
            catchError(this.handleError)
        );
    }

    changeBuldinAddress(address, id, preDispatch) {
        const options = {
            lat: address.lat,
            long: address.lng,
            pre_dispatch_id: preDispatch,
            product_id: id,
            address: {
                city: address.city,
                cap: address.cap,
                street: address.street,
                houseNumber: address.houseNumber
            }
        };
        return this.http.post<any>(AppConfig.endpoints.editBuildingAddress, options).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        console.log(error);
        return throwError('');
    }

}
