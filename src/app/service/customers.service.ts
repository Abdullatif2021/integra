import { Injectable } from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

  getCustomersByName(name): Observable<any> {
      const options = { params: new HttpParams().set('name', name)};
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCustomers, options).pipe(
          catchError(this.handleError)
      );
  }


  handleError(error: HttpErrorResponse): Observable<any> {
      if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
      } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      }
      return throwError('');
  }

}
