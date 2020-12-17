import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {FiltersService} from '../../../service/filters.service';
import {ProductsService} from '../../../service/products.service';
import {AppConfig} from '../../../config/app.config';
import {throwError} from 'rxjs';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(
      private http: HttpClient,
      private filtersService: FiltersService,
      private productsService: ProductsService
  ) { }
  selectactivity = [] ;
  createNewActivity(method, name = ''): Observable<any> {
      const data = <any>{} ;
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      if (method === 'filters') {
          options.params = this.filtersService.getHttpParams(options.params, true);
          data.filters = this.filtersService.getFilterObject(true);
      } else {
          data.product_ids = this.productsService.selectedProducts.map(p => p.id);
      }
      if (name) {
          options.params = options.params.set('name', name);
      }
      return this.http.post(AppConfig.endpoints.createNewActivity, data, options);
  }

  getAvailableCaps(activity, page = 1, subActivityId): Observable<any> {
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      options.params = options.params.set('activity', activity);
      options.params = options.params.set('pageSize', '30');
      if (subActivityId) {
          options.params = options.params.set('subActivityId', subActivityId);
      }
      options.params = options.params.set('page', `${page}`);

      return this.http.get(AppConfig.endpoints.getActivityAvailableCaps, options);
  }

  getAvailableProductsCategories(activity, caps, subActivityId = null, page = 1): Observable<any> {
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      options.params = options.params.set('activity', activity);
      options.params = options.params.set('caps', caps.map(c => c.id));
      options.params = options.params.set('pageSize', '30000');
      if (subActivityId) {
          options.params = options.params.set('subActivityId', subActivityId);
      }
      options.params = options.params.set('page', `${page}`);
      return this.http.get(AppConfig.endpoints.getActivityAvailableProductCategories, options);
  }

  getTotalProducts(activity, caps, categories): Observable<any> {
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      options.params = options.params.set('activity', activity);
      options.params = options.params.set('caps', caps.map(c => c.id));
      options.params = options.params.set('categories', categories.map(c => c.id));
      return this.http.get(AppConfig.endpoints.getActivityTotalProducts, options);
  }

  getSubActivityEndDate(
      activity, startDate, postmen, caps, categories, qtyPerDay, nextSaturdayStatus,
      subActivityId = null): Observable<any>
  {
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      options.params = options.params.set('activity', activity);
      options.params = options.params.set('startDate', startDate);
      options.params = options.params.set('caps', caps.map(c => c.id));
      options.params = options.params.set('categories', categories.map(c => c.id));
      options.params = options.params.set('postmen', postmen ? postmen.map(p => p.id) : []);
      options.params = options.params.set('qtyPerDay', qtyPerDay);
      options.params = options.params.set('nextSaturdayStatus', !nextSaturdayStatus ? '0' : '1');
      if (subActivityId) {
          options.params = options.params.set('subActivityId', subActivityId);
      }
      return this.http.get(AppConfig.endpoints.getActivitySubActivityEndDate, options);
  }

  getOperators(page = 1): Observable<any> {
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      options.params = options.params.set('page', `${page}`);
      options.params = options.params.set('pageSize', '30');
      return this.http.get(AppConfig.endpoints.getActivitiesOperators, options);
  }

  getPostmen(
      activityId, startDate, caps, categories, qtyPerDay, nextSaturdayStatus,
      recommended = 0, page = 1, subActivityId = null
  ): Observable<any> {
      const options = {params: new HttpParams(), headers: new HttpHeaders()};
      options.params = options.params.set('page', `${page}`);
      options.params = options.params.set('activity', `${activityId}`);
      options.params = options.params.set('startDate', startDate);
      options.params = options.params.set('caps', caps.map(c => c.id));
      options.params = options.params.set('categories', categories.map(c => c.id));
      options.params = options.params.set('qtyPerDay', qtyPerDay);
      options.params = options.params.set('nextSaturdayStatus', !nextSaturdayStatus ? '0' : '1');
      options.params = options.params.set('recommended', `${recommended}`);
      options.params = options.params.set('pageSize', '30');
      if (subActivityId) {
          options.params = options.params.set('subActivityId', subActivityId);
      }
      return this.http.get(AppConfig.endpoints.getActivityPostmen, options);
  }

  createSubActivity(activity, operator, postmen, caps, categories, qtyPerDay, nextSaturdayStatus, startDate): Observable<any> {
        const data = {
            activity: activity,
            operator: operator,
            postmen: postmen.map(p => p.id),
            caps: caps.map(c => c.id),
            categories: categories.map(c => c.id),
            qtyPerDay: qtyPerDay,
            nextSaturdayStatus: nextSaturdayStatus ? 1 : 0,
            startDate: startDate
        }
        return this.http.post(AppConfig.endpoints.createSubActivity, data);
  }

  updateSubActivity(subActivity, operator, postmen, caps, categories, qtyPerDay, nextSaturdayStatus, startDate): Observable<any> {
        const data = {
            subActivity: subActivity,
            operator: operator,
            postmen: postmen.map(p => p.id),
            caps: caps.map(c => c.id),
            categories: categories.map(c => c.id),
            qtyPerDay: qtyPerDay,
            nextSaturdayStatus: nextSaturdayStatus ? 1 : 0,
            startDate: startDate
        }
        return this.http.post(AppConfig.endpoints.updateSubActivity, data);
  }

  updateActivity(activity, name): Observable<any> {
      const data = {
          activity: activity,
          name: name
      }
      return this.http.post(AppConfig.endpoints.updateActivity, data);
  }
//
// handleError(error: HttpErrorResponse) {
//     if (error.error instanceof ErrorEvent) {
//         console.error('An error occurred:', error.error.message);
//     } else {
//         console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
//     }
//     return throwError('');
// }

  deleteActivity(activity): Observable<any> {
      return this.http.post(AppConfig.endpoints.deleteActivity(activity), {});
  }

}
