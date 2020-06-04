import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {FiltersService} from './filters.service';
import {PaginationService} from './pagination.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
      private http: HttpClient,
      private filtersService: FiltersService,
      private paginationService: PaginationService
  ) { }

  public selectedProducts = [];
  selectAllOnLoadEvent = new EventEmitter() ;
  getToDeliverProducts(cities, streets, order_field = null, order_method = '1') {
      const options = { params: new HttpParams()
              .set('page', this.paginationService.current_page)
              .set('pageSize', this.paginationService.rpp)};

      const citiesType = this.filtersService.getGrouping();
      if (citiesType === 'by_client') {
          options.params = options.params.set('by_clients_Filter', '1');
      }
      if (cities.all) {
          if (cities.items.length) {
              if (citiesType === 'by_client') {
                  options.params = options.params.set('exclude_clients_ids', cities.items);
              } else {
                  options.params = options.params.set('exclude_cities_ids', cities.items);
              }
          }
          if (cities.search) {
              if (citiesType === 'by_client') {
                  options.params = options.params.set('by_clients_search', cities.search);
              } else {
                  options.params = options.params.set('byCitiesSearch', cities.search);
              }
          }
      } else {
          if (cities.items.length) {
              if (citiesType === 'by_client') {
                  options.params = options.params.set('clients', cities.items);
              } else {
                  options.params = options.params.set('cities_ids', cities.items);
              }
          }
      }
      if (streets.all) {
          if (streets.items.length) {
              console.log('the fucking streets', streets.items);
              options.params = options.params.set('exclude_streets_ids', streets.items);
          }
          if (streets.search) {
              options.params = options.params.set('byStreetsSearch', streets.search);
          }
      } else {
          if (streets.items.length) {
              options.params = options.params.set('streets_ids', streets.items);
          }
      }
      if (order_field) {
          options.params = options.params.set('key', order_field) ;
          options.params = options.params.set('orderMethod', order_method) ;
      }
      options.params = this.filtersService.getHttpParams(options.params) ;
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getProducts, options).pipe(
          catchError(this.handleError)
      );
  }

  getPreDispatchProducts(id) {
      const options = { params: new HttpParams()
              .set('page', this.paginationService.current_page)
              .set('pageSize', this.paginationService.rpp)
              .set('pre_dispatch_id', id)
      };
      options.params = this.filtersService.getHttpParams(options.params) ;
      return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatchProducts, options).pipe(
          catchError(this.handleError)
      );
  }

  selectAllOnLoad(val) {
      this.selectAllOnLoadEvent.emit(val);
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
