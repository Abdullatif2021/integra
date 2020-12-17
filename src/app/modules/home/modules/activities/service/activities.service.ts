import {Injectable} from '@angular/core';
import {FiltersService} from '../../../../../service/filters.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AppConfig} from '../../../../../config/app.config';
import {throwError} from 'rxjs';
import {PaginationService} from '../../../../../service/pagination.service';


@Injectable()
export class ActivitiesService {


    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService
    ) {
    }
    selectactivity = [] ;

    getActivities() {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', `${this.paginationService.current_page}`);
        options.params = options.params.set('pageSize', `${this.paginationService.rpp}`);
        options.params = this.filtersService.getHttpParams(options.params);
        return this.http.get<any>(AppConfig.endpoints.getActivities, options).pipe(
            catchError(this.handleError)
        );
    }

    getSubActivities() {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', `${this.paginationService.current_page}`);
        options.params = options.params.set('pageSize', `${this.paginationService.rpp}`);
        options.params = this.filtersService.getHttpParams(options.params);
        return this.http.get<any>(AppConfig.endpoints.getSubActivities, options).pipe(
            catchError(this.handleError)
        );
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

    delete(ids, confirm = false) {
        const data = {
            ids: ids,
            confirm: confirm
        };
        return this.http.post<any>(AppConfig.endpoints.activityDelete, data).pipe(
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
