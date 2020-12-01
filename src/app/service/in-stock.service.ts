import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {FiltersService} from './filters.service';
import {PaginationService} from './pagination.service';

@Injectable()
export class InStockService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService,
    ) {
    }

    selectedProducts = [];
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
    getInStockProducts(cities, streets, order_field = null, order_method = '1') {
        const options = { params: new HttpParams()
                .set('page', this.paginationService.current_page)
                .set('pageSize', this.paginationService.rpp)
                .set('statusType', 'in_stock')};
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
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        return throwError('');
    }
    getStats() {
        const options = {params: new HttpParams()};
        options.params = options.params.set('type', 'not_delivered');
        options.params = options.params.set('page', '1');
        options.params = options.params.set('pageSize', '500');
        return this.http.get<any>(AppConfig.endpoints.getAvailableStatuses, options);
    }

}
