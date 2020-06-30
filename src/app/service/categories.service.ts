import { Injectable } from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {ApiResponseInterface} from '../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }


  getCategoriesByName(name) {
      const options = {
          params: new HttpParams().set('name', name).set('pageSize', '100')
      };
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCategories, options).pipe(
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
