import {EventEmitter, Injectable} from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {FilterInterface} from '../core/models/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(private http: HttpClient) { }
  filtersChanges = new EventEmitter<number>() ;
  filters = [];

  getFiltersData() {
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getFiltersData).pipe(
          catchError(this.handleError)
      );
  }

  updateFilters(filters) {
    this.filters = filters ;
    this.filtersChanges.emit(filters);
  }

  getHttpParams(options: HttpParams) {
    if ( typeof this.filters !== 'object') {return options ; }
    this.filters.forEach((filter: FilterInterface) => {
      if (!filter.value && filter.value === '') { return ; }
      options = options.set(filter.key, filter.value) ;
      console.log(options, filter.key, filter.value);
    });

    return options ;
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
