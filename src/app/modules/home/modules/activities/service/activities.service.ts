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


    getActivities() {
        const options = { params: new HttpParams() };
        options.params = options.params.set('page', `${this.paginationService.current_page}`);
        options.params = options.params.set('pageSize', `${this.paginationService.rpp}`);
        return this.http.get<any>(AppConfig.endpoints.getActivities, options).pipe(
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

    getFilledActivities() {
        return new Promise(async (resolve, reject) => {

            let error = null ;
            const activities = await this.getActivities().toPromise().catch(e => {
                error = e;
            });

            const postmen = await this.getPostmen().toPromise().catch( e => {
                error = e;
            });

            const operators = await this.getOperators().toPromise().catch( e => {
                error = e;
            });

            if (error) { return reject(error); }
            const filledData = [];
            activities.data.forEach(row => {
                row.startedAt = row.startedAt ? row.startedAt.substr(0, 10).split('/').reverse().join('-') : null;
                row.doneAt = row.doneAt ? row.doneAt.substr(0, 10).split('/').reverse().join('-') : null;
                row.postmen = row.postmen && row.postmen.length ? row.postmen[0].id : null;
                if (row.user) {
                    row.user = row.user.id;
                }
                filledData.push( {
                    ...row,
                    productValue: row.productsCategories.length ? row.productsCategories[0].id : null,
                    capValue: row.caps ? row.caps[0] : null,
                    users_list: operators.data,
                    postmen_list: postmen.data,
                });
            });
            return resolve({data: filledData, pagination: activities.pagination}) ;
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
