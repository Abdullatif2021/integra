import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {Observable} from 'rxjs';
import {group} from '@angular/animations';
import {EventEmitter} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {FiltersService} from './filters.service';
import {PaginationService} from './pagination.service';

@Injectable()
export class NotDeliveredService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService,

    ) {
    }

    // .map(p => p.id)
    selectedProducts = [];
    selectAllOnLoadEvent = new EventEmitter() ;
     setSelectedProducts(products) {
         this.selectedProducts = products.id;
     }
     getSelectedProducts() {
        return this.selectedProducts;
    }
     updateProductsStatusByProducts(products, status) {
        const options = {
            status: status,
            product_ids: products.id,
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.changeProductStatus, options);
    }
    getNotDeliverProducts(cities, streets, order_field = null, order_method = '1') {
        const options = { params: new HttpParams()
                .set('page', this.paginationService.current_page)
                .set('pageSize', this.paginationService.rpp)
                .set('statusType', 'not_delivered')};
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
  
    getStats() {
        const options = {params: new HttpParams()};
        options.params = options.params.set('type', 'not_delivered');
        options.params = options.params.set('page', '1');
        options.params = options.params.set('pageSize', '500');
        return this.http.get<any>(AppConfig.endpoints.getAvailableStatuses, options);
    }
    selectAllOnLoad(val) {
        this.selectAllOnLoadEvent.emit(val);
    }
    // get the pagination of products that should be added on pre-dispatch create
    getProductByCategory(products_ids, on_create = true, page = 2, per_page = 25) {
        const options = {
            products_ids: products_ids,
            on_create: on_create,
            page: page,
            per_page: per_page,
        }
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.getProductByCategory, options);
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

