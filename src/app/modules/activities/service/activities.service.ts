import {EventEmitter, Injectable} from '@angular/core';
import {FiltersService} from '../../../service/filters.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../../../config/app.config';
import {throwError} from 'rxjs';
import {PaginationService} from '../../../service/pagination.service';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';


@Injectable()
export class ActivitiesService {


    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService
    ) {
    }

    selectactivities = [] ;
    reload = new EventEmitter();

    getActivities(dateIndex = 0) {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', `${this.paginationService.current_page}`);
        options.params = options.params.set('pageSize', `${this.paginationService.rpp}`);
        options.params = options.params.set('dateIndex', `${dateIndex}`);
        options.params = this.filtersService.getHttpParams(options.params);
        return this.http.get<any>(AppConfig.endpoints.getActivities, options).pipe(
            catchError(this.handleError)
        );
    }

    getSubActivities(dateIndex = 0) {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', `${this.paginationService.current_page}`);
        options.params = options.params.set('pageSize', `${this.paginationService.rpp}`);
        options.params = options.params.set('dateIndex', `${dateIndex}`);
        options.params = this.filtersService.getHttpParams(options.params);
        return this.http.get<any>(AppConfig.endpoints.getSubActivities, options).pipe(
            catchError(this.handleError)
        );
    }
    getSelectedSubActivities() {
        return this.selectactivities.map((items) => items.code && items.id );
    }
    getPostmen() {
        return this.http.get<any>(AppConfig.endpoints.getActivitiesPostmen, {}).pipe(
            catchError(this.handleError)
        );
    }

    getOperators() {
        return this.http.get<any>(AppConfig.endpoints.getActivitiesOperators, {}).pipe(
            catchError(this.handleError)
        );
    }

    getFilledActivities(unsubscripe) {
        return new Promise(async (resolve, reject) => {

            let error = null ;

            const postmen = await this.getPostmen().toPromise().catch( e => {
                error = e;
            });

            const operators = await this.getOperators().toPromise().catch( e => {
                error = e;
            });
            return resolve({}) ;
        });
    }

    ChangeSubActivityStatus(ids, status) {
        const options = {
            state: status,
            filters : Object.assign({ids})
        };
        return this.http.post<ApiResponseInterface>(AppConfig.endpoints.changeSubActivityStatus, options);
    }
    deleteSubActivity(ids, confirm = false) {
        const data = {
            ids: ids,
            confirm: confirm
        };
        return this.http.post<any>(AppConfig.endpoints.subActivityDelete, data).pipe(
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
