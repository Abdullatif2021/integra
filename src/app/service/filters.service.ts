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
  // the filters was changed and the changes was committed
  filtersChanges = new EventEmitter<number>() ;
  // the filters was changed but the changes was not committed
  cleared = new EventEmitter<number>() ;
  fields = new EventEmitter() ;

  // the user had clicked on change view type button
  changeViewButtonClicked = new EventEmitter() ;
  changeViewTabsChanges = new EventEmitter<string>() ;
  filters = <any>{};
  specials: any = {};
  barcodes = [];
  grouping = 'by_cap';

  getFiltersData() {
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getFiltersData).pipe(
          catchError(this.handleError)
      );
  }

  updateFilters(filters, placeholders = {}) {
    const grouping = filters.grouping;
    this.grouping =  grouping ? grouping : 'by_cap' ;
    this.filters = Object.assign({}, filters) ;
      // fix filters
    Object.keys(this.filters).forEach(key => {
        if (typeof this.filters[key] === 'object' && !Array.isArray(this.filters[key])) {
            this.filters[key] = this.filters[key].id ;
        }
    });
    delete this.filters.grouping ;
    this.filtersChanges.emit(<any>{filters: filters, placeholders: placeholders});
  }

  getGrouping() {
      return this.grouping;
  }

  getHttpParams(options: HttpParams) {
    let applied = false ;
    // if there is no filters return the original options
    if ( typeof this.filters !== 'object') {return options ; }
    // loop through all filters and add them if there value was not empty string or null
    Object.keys(this.filters).forEach((filterKey) => {
      if (!this.filters[filterKey] || this.filters[filterKey] === '') { return ; }
      options = options.set(filterKey, this.filters[filterKey]) ;
      // if a filter is valid, set applied to true
      applied = true ;
    });
    // if any filter was applied set withFilter param to true
    if (applied) { options = options.set('withFilter', '1') ; }
    return options ;
  }

  getFiltersObject() {
      if ( typeof this.filters !== 'object') { return [] ; }
      const _filters = Object.assign({}, this.filters);
      const grouping = _filters['grouping'] ? _filters['grouping'] : 'by_cap';
      if (this.specials.cities && this.specials.cities.all) {
          if (this.specials.cities.items.length) {
              _filters[grouping === 'by_cap' ? 'exclude_cities_ids' : 'exclude_clients_ids'] = this.specials.cities.items;
          }
          if (this.specials.cities.search) {
              _filters[grouping === 'by_cap' ? 'byCitiesSearch' : 'by_clients_search'] = this.specials.cities.search;
          }
      } else if (this.specials.cities) {
          if (this.specials.cities.items.length) {
              _filters[grouping === 'by_cap' ? 'cities_ids' : 'clients'] = this.specials.cities.items;
          }
      }
      if (this.specials.streets && this.specials.streets.all) {
          if (this.specials.streets.items.length) {
              _filters['exclude_streets_ids'] = this.specials.streets.items;
          }
          if (this.specials.streets.search) {
              _filters['byStreetsSearch'] = this.specials.streets.search;
          }
      } else if (this.specials.streets) {
          if (this.specials.streets.items.length) {
              _filters['streets_ids'] = this.specials.streets.items;
          }
      }

      if (this.specials.postmen && this.specials.postmen.items.length) {
          _filters['postmen'] = this.specials.postmen.items;
      }
      if (grouping !== 'by_cap') {
          _filters['by_clients_Filter'] = '1';
      }
      return _filters ;
  }

  addBarcodeFilter(barcode) {
      this.barcodes.push(barcode) ;
      this.updateFilters({barcode: this.barcodes});
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

  setSpecialFilter(key, value) {
      this.specials[key] = value ;
  }


  clickChangeViewButton(data) {
      this.changeViewButtonClicked.emit(data);
  }

  changeViewTabsChanged(data) {
      this.changeViewTabsChanges.emit(data);
  }

  clear() {
      this.filters = [] ;
      this.specials = {} ;
      this.grouping = 'by_cap';
      this.clearBarcodFilter();
      this.cleared.emit(1);
  }

}
