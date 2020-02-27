import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/index';
import { AppConfig } from '../../../config/app.config';
import {SnotifyService} from 'ng-snotify';
import {reject} from 'q';

@Injectable({
    providedIn: 'root'
})

export class PlanningService {

    constructor(
        private http: HttpClient,
        private snotifyService: SnotifyService,
    ) { }

    preDispatchDataChanges = new EventEmitter() ;
    moveItemsToInPlaningChanges = new EventEmitter<any>() ;

    changePreDispatchData(data) {
        this.preDispatchDataChanges.emit(data);
    }

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

    sendSaveParametersRequest(data) {
        return this.http.post<any>(AppConfig.endpoints.changePreDispatchParameters, data).pipe(
            catchError(this.handleError)
        );
    }


    async divideToDistenta(preDispatch) {
        await this.run(this.sendDivideToDistentaRequest(preDispatch), 'Dividing..', false, false);
    }

    sendDivideToDistentaRequest(preDispatch) {
        return this.http.post<any>(AppConfig.endpoints.divideToDistenta(preDispatch), {}).pipe(
            catchError(this.handleError)
        );
    }

    async saveParameters(data, success) {
        await this.run(this.sendSaveParametersRequest(data), 'Saving', success, () => {
            console.log('error');
        });
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
