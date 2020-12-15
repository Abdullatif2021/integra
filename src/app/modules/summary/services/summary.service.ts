import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../config/app.config';
import {FiltersService} from '../../../service/filters.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(
      private http: HttpClient,
      private filtersService: FiltersService,
  ) { }


  getProductsByState(page = 1, state) {
      const options = {params: new HttpParams()};
      options.params = options.params.set('page', `${page}`);
      options.params = options.params.set('state', state);
      options.params = this.filtersService.getHttpParams(options.params) ;
      return <any>this.http.get(AppConfig.endpoints.getSummaryProductsByState, options);
  }

}
