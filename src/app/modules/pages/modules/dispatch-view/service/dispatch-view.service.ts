import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../../../config/app.config';
import {Observable} from 'rxjs';

@Injectable()
export class DispatchViewService {

  constructor(
      private http: HttpClient,
  ) { }


  getDispatchData(dispatch, page = 1): Observable<any> {
      const options = {params: new HttpParams()};
      options.params = options.params.set('page', `${page}`);
      options.params = options.params.set('pageSize', '15');
      return this.http.get<any>(AppConfig.endpoints.getSetProductsAndPath(dispatch), options);
  }

  getSetPath(setId): Observable<any> {
      return this.http.get<any>(AppConfig.endpoints.getSetPath(setId));
  }
}
