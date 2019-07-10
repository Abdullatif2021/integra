import {EventEmitter, Injectable} from '@angular/core';
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
export class PreDispatchService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService
    ) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    selectedPreDispatches = [] ;

    getPreDispatchList() {
        const options = { params: new HttpParams()};
        options.params = options.params.set('page', '1') ;
        options.params = options.params.set('pageSize', '50') ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatched, options).pipe(
            catchError(this.handleError)
        );
    }

    getPreDispatchItems() {
        const options = { params: new HttpParams()};
        options.params = options.params.set('page', this.paginationService.current_page) ;
        options.params = options.params.set('pageSize', this.paginationService.rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatched, options).pipe(
            catchError(this.handleError)
        );
    }

    createBySelected(name, products) {
        const options = {
            name: name,
            product_ids: products,
            byFilter: 0,
        }
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.createPreDispatched, options, this.httpOptions);
    }

    createByFilters(name) {
        const options = {
            name: name,
            byFilter: 1,
            filters: this.filtersService.getFiltersObject()
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.createPreDispatched, options).pipe(
            catchError(this.handleError)
        );
    }

    addProductsBySelected(id, products) {
        const options = {
            id: id,
            product_ids: products,
            confirm: true,
            byFilter: false,
        }
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.preDispatchAddProducts, options).pipe(
            catchError(this.handleError)
        );
    }

    addProductsByFilters(id) {
        const options = {
            id: id,
            confirm: true,
            filters: this.filtersService.getFiltersObject(),
            byFilter: '1',
        }
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.preDispatchAddProducts, options).pipe(
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

    merge(items, name) {
        const options = {
            name: name,
            pre_dispatch_ids: items,
        }
        return this.http.post<any>(AppConfig.endpoints.mergePreDispatches, options).pipe(
            catchError(this.handleError)
        );
    }
}
