import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/index';
import {SnotifyService} from 'ng-snotify';
import {GoogleDirectionsService} from './google-directions.service';
import {BackProcessingService} from '../back-processing.service';
import {AppConfig} from '../../config/app.config';
import {ApiResponseInterface} from '../../core/models/api-response.interface';
import {MapService} from '../map.service';

@Injectable({
    providedIn: 'root'
})

export class PlanningService {

    constructor(
        private http: HttpClient,
        private snotifyService: SnotifyService,
        private googleDirectionsService: GoogleDirectionsService,
        private backProcessingService: BackProcessingService,
    ) { }

    moveItemsToInPlaningChanges = new EventEmitter<any>() ;
    moveItemsBackToAddressesChanges = new EventEmitter<any>() ;
    // test = new EventEmitter<any>() ;

    /*** Move to in planning { ***/
    moveItemsToInPlaning(modalRef, force) {
        this.moveItemsToInPlaningChanges.emit({modalRef: modalRef, force: force}) ;
    }
    moveItemsBackToAddresses(modalRef, force) {
        console.log('call 2');
        this.moveItemsBackToAddressesChanges.emit({modalRef: modalRef, force: force}) ;
    }

    sendMoveToInPlanningRequest(preDispatchId, data, filter = null, status = null, confirm = false) {
        data = {
            pre_dispatch_id: parseInt(preDispatchId, 10),
            data: data
        };
        if (confirm) {
            data.confirm = 1 ;
        }
        if (filter) {
            data['filter'] = filter + '';
        }
        if (status) {
            data['status'] = status ;
        }
        return this.http.post<any>(AppConfig.endpoints.moveToInPlanning, data).pipe(
            catchError(this.handleError)
        );
    }

    moveToInPlanning(preDispatchId, data, filter = null, status = null, success) {
        this.run(this.sendMoveToInPlanningRequest(preDispatchId, data, filter, status, true), 'Moving Items', success, () => {
            console.log('error');
        });
    }

    moveToInPlanningCheck(preDispatchId, data, filter = null, status = null) {
        return this.sendMoveToInPlanningRequest(preDispatchId, data, filter, status, false);
    }

    run(method, msg, success, failed) {
        const promise = new Promise(function(resolve, reject) {
            method.subscribe(
                data => {
                    if (data && data.success) {
                        let body = 'Success' ;
                        if (typeof success === 'function') {
                            body = success(data);
                        }
                        if (typeof body !== 'string') { body = 'Success'; }
                        resolve({body: body, config: { showProgressBar: false, timeout: 3000 }});
                    } else {
                        if (typeof failed === 'function') {
                            failed(data) ;
                        }
                        reject({body: data ? data.status : 'Something went wrong', config: { showProgressBar: false, timeout: 3000 }});
                    }
                },
                error => {
                    let body = error.msg ? error.msg : 'Error' ;
                    if (typeof failed === 'function') {
                        body = failed(error) ;
                    }
                    reject({body: body, config: { showProgressBar: false, timeout: 3000 }});
                }
            );
        });
        this.snotifyService.async(msg, promise, { showProgressBar: true, timeout: 10000 });
    }

    /*** } Move to in planning ***/

    /*** Parameters { ***/

    sendSaveParametersRequest(data) {
        return this.http.post<any>(AppConfig.endpoints.changePreDispatchParameters, data).pipe(
            catchError(this.handleError)
        );
    }

    async saveParameters(data, success, error) {
        await this.run(this.sendSaveParametersRequest(data), 'Saving', success, error);
    }

    /*** } Parameters ***/

    /*** Auto Planning { ***/

    divideToDistenta(preDispatch, checkResult = null, checkAddProductsResult = null) {
        const data = <any>{confirm: checkResult};
        if (checkAddProductsResult) {
            data.productConfirm = checkAddProductsResult;
        }
        return this.http.post<any>(AppConfig.endpoints.divideToDistenta(preDispatch), data).pipe(
            catchError(this.handleError)
        );
    }

    getMatchesRate(preDispatch, match) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('match', match);
        return this.http.get<any>(AppConfig.endpoints.getMatchesRate(preDispatch), options);
    }

    async confirmPlanning(preDispatch, match, notMatchesOption, departureDate, successHandler, errorHandler) {
        await this.run(this.sendConfirmPlanningRequest(preDispatch, match, notMatchesOption, departureDate), 'Matching', (data) => {
            successHandler(data);
            return 'Pre-Dispatches was matched';
        }, (error) => {
            errorHandler(error);
            return 'Something went wrong';
        });
    }

    sendConfirmPlanningRequest(preDispatch, match, notMatchesOption, departureDate) {
        return this.http.post<any>(AppConfig.endpoints.confirmPlanning(preDispatch), {
            match: match,
            notMatchesOption: notMatchesOption,
            departureDate: departureDate
        });
    }
    /*** } Auto Planning ***/


    /*** Path drawing { ***/
    getDirections(setId, page = 1) {
        const options = {params: new HttpParams(), headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        options.params = options.params.set('page', page + '');
        return this.http.get<any>(AppConfig.endpoints.getSetProductsCoordinates(setId), options);
    }

    savePath(setId, path) {
        const options = { path: path ? JSON.stringify(path) : '[]'};
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.saveSetPath(setId), options,
            {headers: new HttpHeaders({'ignoreLoadingBar': ''})}).pipe(
            catchError(this.handleError)
        );
    }
    setMapPriority(order) {
        const options = { data: order };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.setMapPriority, options,
            {headers: new HttpHeaders({'ignoreLoadingBar': ''})}).pipe(
            catchError(this.handleError)
        );
    }

    async drawPaths(sets, preDispatch, handle) {
        for (let i = 0; i < sets.length; ++i) {
            let path = [];
            let page = 1 ;
            let waypoints ;
            let lp = 0 ;
            do {
                const order = [];
                waypoints = await this.getDirections(sets[i].id, page).toPromise();
                let startPoint = preDispatch.startPoint ;
                if (path.length) {
                    startPoint = path[path.length - 1];
                }
                let endPoint = preDispatch.endPoint;
                if (!waypoints.data.last_page) {
                    endPoint = waypoints.data[waypoints.data.length];
                }
                const temp = await this.googleDirectionsService.getDirections(startPoint, waypoints.data.data, preDispatch.endPoint) ;
                if (temp && temp.order && temp.path) {
                    path = path.concat(temp.path);
                    temp.order.forEach(item => {
                        item.priority += lp;
                        item.set = sets[i].id;
                        order.push(item);
                    });
                    lp += order.length;
                    const priority = await this.setMapPriority(order).toPromise();
                } else { console.log('something went wrong, was not able to find a part of the path'); }
                page ++ ;
            } while ( !waypoints.data.last_page );
            const save = await this.savePath(sets[i].id, path).toPromise() ;
            if (!this.backProcessingService.isRunning('planning-' + preDispatch.id)) {
                return false ;
            }
        }
        this.backProcessingService.ultimatePause(preDispatch.id);
    }

    getSetsWithoutPaths(preDispatchId) {
        const options = {params: new HttpParams(), headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        return this.http.get<any>(AppConfig.endpoints.getSetsWithoutPaths(preDispatchId), options);
    }
    /*** } Path drawing ***/


    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        return throwError('');
    }

}
