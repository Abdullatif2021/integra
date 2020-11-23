import {EventEmitter, Injectable} from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FiltersService} from './filters.service';
import {PaginationService} from './pagination.service';
import {IntegraaModalService} from './integraa-modal.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PreDispatchService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService,
        private integraaModalService: IntegraaModalService,
        private translate: TranslateService,
        ) {}

    public selectedPreDispatches = [] ;
    canPlanChanges = new EventEmitter<boolean>();
    preDispatchStatusChanges = new EventEmitter();
    resultsMoveToButtonClicked = new EventEmitter();
    confirmProductsWithSameInfoShouldBeSelected = new EventEmitter();
    confirmProductsShouldBeAddedToPreDispatchWithSameInfo = new EventEmitter();
    can_plan = false;
    showConfirmPlanningModalCalls = new EventEmitter<any>();
    showConfirmPlanningAddProductsModalCalls = new EventEmitter<any>();
    confirmPlanningModalGotUserResponse = new EventEmitter();
    confirmPlanningAddProductsModalGotUserResponse = new EventEmitter();
    // used when an Integraa modal is opened to perform an action on a specific pre-Dispatch {
    private activePredispatch = null ;

    getActivePreDispatch() {
        return this.activePredispatch ;
    }

    setActivePreDispatch(preDispatch) {
        this.activePredispatch = preDispatch;
    }
    // }


    clickResultsMoveToButton(to) {
        this.resultsMoveToButtonClicked.emit(to);
    }

    preDispatchStatusChanged(status) {
        this.preDispatchStatusChanges.emit(status);
    }

    setCanPlan(can_plan) {
        this.can_plan = can_plan ;
        this.canPlanChanges.emit(can_plan);
    }

    translateStatus(status) {
        switch (status) {
            case 'in_localize': return this.translate.instant('services.pre_dispatch_service.translateStatus.in_localize');
            case 'notPlanned': return this.translate.instant('services.pre_dispatch_service.translateStatus.notPlanned');
            case 'planned': return this.translate.instant('services.pre_dispatch_service.translateStatus.planned');
            case 'inPlanning': return this.translate.instant('services.pre_dispatch_service.translateStatus.inPlanning');
            case 'localized': return this.translate.instant('services.pre_dispatch_service.translateStatus.localized');
            case 'in_grouping': return this.translate.instant('services.pre_dispatch_service.translateStatus.in_grouping');
            case 'in_divide': return this.translate.instant('services.pre_dispatch_service.translateStatus.in_divide');
            case 'in_drawing': return this.translate.instant('services.pre_dispatch_service.translateStatus.in_drawing');
            case 'drawing_paths': return this.translate.instant('services.pre_dispatch_service.translateStatus.drawing_paths');
            default: return status;
        }
    }

    getPreDispatchList(page = 1, pageSize = '50', term = '') {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', page + '') ;
        options.params = options.params.set('pageSize', pageSize) ;
        options.params = options.params.set('term', term) ;
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatched, options).pipe(
            catchError(this.handleError)
        );
    }

    showConfirmProductsWithSameInfoShouldBeSelected(data) {
        this.confirmProductsWithSameInfoShouldBeSelected.emit(data);
    }

    showConfirmProductsShouldBeAddedToPreDispatchWithSameInfo(data) {
        this.confirmProductsShouldBeAddedToPreDispatchWithSameInfo.emit(data);
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

    createBySelected(name, products, confirm = false, pre_dispatch_id = null) {
        const options = <any>{
            name: name,
            product_ids: products,
            byFilter: 0,
            confirm: confirm,
        };
        if (pre_dispatch_id) {
            options.pre_dispatch_id = pre_dispatch_id ;
        }
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.createPreDispatched, options);
    }

    createByFilters(name, confirm) {
        const options = {
            name: name,
            byFilter: 1,
            filters: this.filtersService.getFiltersObject(),
            confirm: confirm
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
        };
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
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.preDispatchAddProducts, options).pipe(
            catchError(this.handleError)
        );
    }

    edit(id, name) {
        const options = {
            id: id,
            name: name
        };
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

    showConfirmPlanningModal(preDispatch, force = false) {
        this.showConfirmPlanningModalCalls.emit(true);
        return new Promise((resolve, reject) => {
            const subscription = this.confirmPlanningModalGotUserResponse.subscribe(
                data => {
                    subscription.unsubscribe();
                    return resolve(data);

                }
            );
        });
    }

    showConfirmPlanningAddProductsModal(preDispatch, _data) {
        this.showConfirmPlanningAddProductsModalCalls.emit(_data);
        return new Promise((resolve, reject) => {
            const subscription = this.confirmPlanningAddProductsModalGotUserResponse.subscribe(
                data => {
                    subscription.unsubscribe();
                    return resolve(data);

                }
            );
        });
    }

    merge(items, name) {
        const options = {
            name: name,
            pre_dispatch_ids: items,
        };
        return this.http.post<any>(AppConfig.endpoints.mergePreDispatches, options).pipe(
            catchError(this.handleError)
        );
    }
}
