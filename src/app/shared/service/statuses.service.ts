import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../config/app.config';
import {ApiResponseInterface} from '../../core/models/api-response.interface';
import {FiltersService} from '../../service/filters.service';

@Injectable({
  providedIn: 'root'
})
export class StatusesService {

  constructor(
      private http: HttpClient,
      private filtersService: FiltersService
  ) { }

  getStats(type, page = 1, pageSize = 5000) {
      const options = {params: new HttpParams()};
      options.params = options.params.set('type', type);
      options.params = options.params.set('page', `${page}`);
      options.params = options.params.set('pageSize', `${pageSize}`);
      return this.http.get<any>(AppConfig.endpoints.getAvailableStatuses, options);
  }

  updateProductsStatusByProducts(products, status) {
      const options = {
          status: status,
          product_ids: products,
      };
      return this.http.post<ApiResponseInterface>(AppConfig.endpoints.changeProductStatus, options);
  }

  updateProductsStatusByFilters(status) {
      const data = {
          status: status,
      };
      const options = { params: new HttpParams()};
      options.params = this.filtersService.getHttpParams(options.params) ;
      return this.http.post<ApiResponseInterface>(AppConfig.endpoints.changeProductStatus, data, options);
  }

}
