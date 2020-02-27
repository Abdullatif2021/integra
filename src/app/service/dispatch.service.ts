import {Injectable} from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FiltersService} from './filters.service';
import {PaginationService} from './pagination.service';

@Injectable({
    providedIn: 'root'
})
export class DispatchService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService
    ) {}

    selectedDispatches = [] ;

    getDispatches(noProgress = false, postmen, order_field = null, order_method = '1') {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        if (noProgress) {
            options.headers = options.headers.append('ignoreLoadingBar', '');
        }
        options.params = options.params.set('page', this.paginationService.current_page) ;
        options.params = options.params.set('pageSize', this.paginationService.rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (order_field) {
            options.params = options.params.set('key', order_field) ;
            options.params = options.params.set('order_method', order_method) ;
        }
        if (postmen && postmen.items.length) {
            if (postmen.all) {
                options.params = options.params.set('exclude_postmen', postmen.items.toString()) ;
            } else {
                options.params = options.params.set('postmen', postmen.items.toString()) ;
            }
        }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAllSets, options).pipe(
            catchError(this.handleError)
        );
    }

    getAssignedPostmen(page, rpp, name, order) {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('page', page) ;
        options.params = options.params.set('pageSize', rpp) ;
        options.params = options.params.set('name', name) ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAssignedPostmen, options).pipe(
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
