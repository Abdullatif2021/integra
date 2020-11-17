import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {Observable} from 'rxjs';

@Injectable()
export class ProductStatusService {

    constructor(
        private http: HttpClient,
    ) {
    }

getStats(currentStatus: any) {
    const options = {params: new HttpParams()};
    options.params = options.params.set('type', currentStatus);
    options.params = options.params.set('page', '1');
    options.params = options.params.set('pageSize', '500');
    return this.http.get<any>(AppConfig.endpoints.getAvailableStatuses, options);
}
};