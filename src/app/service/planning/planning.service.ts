import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/index';
import {SnotifyService} from 'ng-snotify';
import {GoogleDirectionsService} from './google-directions.service';
import {BackProcessingService} from '../back-processing.service';
import {AppConfig} from '../../config/app.config';
import {ApiResponseInterface} from '../../core/models/api-response.interface';

@Injectable({
    providedIn: 'root'
})

export class PlanningService {

    constructor(
        private http: HttpClient,
        private snotifyService: SnotifyService,
        private googleDirectionsService: GoogleDirectionsService,
        private backProcessingService: BackProcessingService
    ) { }

    moveItemsToInPlaningChanges = new EventEmitter<any>() ;

    /*** Move to in planning { ***/
    moveItemsToInPlaning(modalRef, force) {
        this.moveItemsToInPlaningChanges.emit({modalRef: modalRef, force: force}) ;
    }

    sendMoveToInPlanningRequest(preDispatchId, data, confirm = false) {
        data = {
            pre_dispatch_id: parseInt(preDispatchId, 10),
            data: data
        }
        if (confirm) {
            data.confirm = 1 ;
        }
        return this.http.post<any>(AppConfig.endpoints.moveToInPlanning, data).pipe(
            catchError(this.handleError)
        );
    }

    moveToInPlanning(preDispatchId, data, success) {
        this.run(this.sendMoveToInPlanningRequest(preDispatchId, data, true), 'Moving Items', success, () => {
            console.log('error');
        });
    }

    moveToInPlanningCheck(preDispatchId, data) {
        return this.sendMoveToInPlanningRequest(preDispatchId, data, false);
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
                        resolve({body: body, config: { showProgressBar: false, timeout: 3000 }});
                    } else {
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

    async saveParameters(data, success) {
        await this.run(this.sendSaveParametersRequest(data), 'Saving', success, () => {
            console.log('error');
        });
    }

    /*** } Parameters ***/

    /*** Auto Planning { ***/

    divideToDistenta(preDispatch) {
        return this.http.post<any>(AppConfig.endpoints.divideToDistenta(preDispatch), {}).pipe(
            catchError(this.handleError)
        );
    }

    getMatchesRate(preDispatch, match) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('match', match);
        return this.http.get<any>(AppConfig.endpoints.getMatchesRate(preDispatch), options);
    }

    async confirmPlanning(preDispatch, match, notMatchesOption, departureDate) {
        await this.run(this.sendConfirmPlanningRequest(preDispatch, match, notMatchesOption, departureDate), 'Matching', (data) => {
            return 'Pre-Dispatches was matched';
        }, (error) => {
            return 'Something went wring';
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
    getDirections(setId) {
        const options = {params: new HttpParams(), headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        return this.http.get<any>(AppConfig.endpoints.getSetProductsCoordinates(setId), options);
    }

    savePath(setId, path) {
        const options = { path: path ? JSON.stringify(path.polyline) : '{}' };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.saveSetPath(setId), options).pipe(
            catchError(this.handleError)
        );
    }

    async drawPaths(sets, preDispatch, handle) {
        for (let i = 0; i < sets.length; ++i) {
            const waypoints = await this.getDirections(sets[i].id).toPromise();
            const path = await this.googleDirectionsService.getDirections(preDispatch.startPoint, waypoints.data, preDispatch.endPoint);
            const save = await this.savePath(sets[i].id, path).toPromise() ;
            handle.emit({progress: ( (i + 1) / sets.length) * 100 });
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
