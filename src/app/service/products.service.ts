import { Injectable } from '@angular/core';
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

  public selectedProducts ;

  getToDeliverProducts(city, street) {
      const options = { params: new HttpParams()
              .set('page', this.paginationService.current_page)
              .set('pageSize', this.paginationService.rpp)};
      if (city) { options.params = options.params.set('cityId', city); }
      if (street) { options.params = options.params.set('streetId', street); }
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

  handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
      } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      }
      return throwError('');
  }
}
