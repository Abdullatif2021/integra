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
    ) {}

    public selectedPreDispatches = [] ;
    canPlanChanges = new EventEmitter<boolean>();
    preDispatchStatusChanges = new EventEmitter();
    can_plan = false;
    // used when an Integraa modal is opened to perform an action on a specific pre-Dispatch {
    private activePredispatch = null ;
    getActivePreDispatch() {
        return this.activePredispatch ;
    }
    setActivePreDispatch(preDispatch) {
        this.activePredispatch = preDispatch;
    }
    // }


    preDispatchStatusChanged(status) {
        this.preDispatchStatusChanges.emit(status);
    }
    setCanPlan(can_plan) {
        this.can_plan = can_plan ;
        this.canPlanChanges.emit(can_plan);
    }

    translateStatus(status) {
        switch (status) {
            case 'in_localize': return 'In localizzazione';
            case 'notPlanned': return 'Non Pianificato';
            case 'planned': return 'Pianificata';
            case 'inPlanning': return 'In Pianificazione';
            case 'localized': return 'Localizzato';
            case 'in_grouping': return 'Ragruppamento';
            case 'in_divide': return 'In Divisione';
            default: return status;
        }
    }

    getPreDispatchList(page = 1, pageSize = '50') {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', page + '') ;
        options.params = options.params.set('pageSize', pageSize) ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatched, options).pipe(
            catchError(this.handleError)
        );
    }

    getPlannedPreDispatches(page = 1, pageSize = '50', search = '') {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', page + '') ;
        options.params = options.params.set('pageSize', pageSize) ;
        if (search) {
            options.params = options.params.set('filter', search) ;
        }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPlannedPreDispatches, options).pipe(
            catchError(this.handleError)
        );
    }

    getLog(preDispatch) {
        return this.http.get<any>(AppConfig.endpoints.getPredispatchLog(preDispatch)).pipe(
            catchError(this.handleError)
        );
    }

    getPreDispatchItems(noProgress = false, order_field = null, order_method = '1') {
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
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.createPreDispatched, options);
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

    edit(id, name) {
        const options = {
            id: id,
            name: name
        }
        return this.http.put<ApiResponseInterface>(AppConfig.endpoints.preDispatchEdit, options).pipe(
            catchError(this.handleError)
        );
    }

    delete(ids, confirm = false) {
        const options = {
            body : {
                ids: ids,
                confirm: confirm
            }
        };
        return this.http.request<ApiResponseInterface>('delete', AppConfig.endpoints.preDispatchEdit, options).pipe(
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

    getPreDispatchData(preDispatchId, ignoreProgress = false): any {
        let options = {} ;
        if (ignoreProgress) {
            options = { headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatchData(preDispatchId), options).pipe(
            catchError(this.handleError)
        );
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
