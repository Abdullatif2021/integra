import {EventEmitter, Injectable} from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {FilterInterface} from '../core/models/filter.interface';
import {FilterConfig} from '../config/filters.config';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(private http: HttpClient) { }
  filtersChanges = new EventEmitter<number>() ;
  cleared = new EventEmitter<number>() ;
  fields = new EventEmitter() ;
  filters = [];
  barcodes = [];

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
    let applied = false ;
    // if there is no filters return the original options
    if ( typeof this.filters !== 'object') {return options ; }
    // loop through all filters and add them if there value was not empty string or null
    this.filters.forEach((filter: FilterInterface) => {
      if (!filter.value || filter.value === '') { return ; }
      options = options.set(filter.key, filter.value) ;
      // if a filter is valid, set applied to true
      applied = true ;
    });
    // if any filter was applied set withFilter param to true
    if (applied) { options = options.set('withFilter', '1') ; }
    return options ;
  }

  getFiltersObject() {
      if ( typeof this.filters !== 'object') { return [] ; }
      // loop through all filters and add them if there value was not empty string or null
      const _filters = {} ;
      this.filters.forEach((filter: FilterInterface) => {
          if (!filter.value || filter.value === '') { return ; }
          _filters[filter.key] = filter.value ;
      });
      return _filters ;
  }

  addBarcodeFilter(barcode) {
      this.barcodes.push(barcode) ;
      this.updateFilters([{key: 'barcode', value: this.barcodes}]);
  }

  clearBarcodFilter() {
      this.barcodes = [] ;
      this.updateFilters([]) ;
  }

  handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
      } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      }
      return throwError('');
  }

  setFields(fields, container) {
      this.fields.emit({fields: fields, container: container});
  }

  clear() {
      this.filters = [] ;
      this.cleared.emit(1);
  }

}
