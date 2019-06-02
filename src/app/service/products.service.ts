import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getToDeliverProducts(page, rpp, city, street) {
      const options = { params: new HttpParams().set('page', page).set('pageSize', rpp)};
      if (city) { options.params = options.params.set('cityId', city); }
      if (street) { options.params = options.params.set('streetId', street); }
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getProducts, options).pipe(
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
