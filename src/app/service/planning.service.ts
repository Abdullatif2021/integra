import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/index';
import { AppConfig } from '../config/app.config';
import {SnotifyService} from 'ng-snotify';

@Injectable({
    providedIn: 'root'
})

export class PlanningService {

    constructor(
        private http: HttpClient,
        private snotifyService: SnotifyService,
    ) { }

    preDispatchDataChanges = new EventEmitter() ;
    moveItemsToInPlaningChanges = new EventEmitter() ;

    changePreDispatchData(data) {
        this.preDispatchDataChanges.emit(data);
    }

    moveItemsToInPlaning() {
        this.moveItemsToInPlaningChanges.emit(true) ;
    }


    sendMoveToInPlanningRequest(preDispatchId, data) {
        data = {
            pre_dispatch_id: preDispatchId,
            data: data
        }
        return this.http.post<any>(AppConfig.endpoints.moveToInPlanning, data).pipe(
            catchError(this.handleError)
        );
    }

    moveToInPlanning(preDispatchId, data, success) {
        this.run(this.sendMoveToInPlanningRequest(preDispatchId, data), 'Moving Items', success, () => {
            console.log('error');
        });
    }

    run(method, msg, success, failed) {
        const promise = new Promise(function(resolve, reject) {
            method.subscribe(
                data => {
                    if (data.success) {
                        let body = 'Success' ;
                        if (typeof success === 'function') {
                            body = success(data);
                        }
                        resolve({body: body, config: { showProgressBar: false, timeout: 3000 }});
                    } else {
                        reject({body: data.status, config: { showProgressBar: false, timeout: 3000 }});
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

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        return throwError('');
    }

}
