import { Injectable } from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipientsService {

  constructor(private http: HttpClient) { }

  getRecipientsByName(name) {
      const options = { params: new HttpParams().set('name', name).set('perPage', '100')};
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getRecipients, options).pipe(
          catchError(this.handleError)
      );
  }

  getCapCity(term) {
      const options = { params: new HttpParams().set('name', term)};
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCapCity, options).pipe(
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
