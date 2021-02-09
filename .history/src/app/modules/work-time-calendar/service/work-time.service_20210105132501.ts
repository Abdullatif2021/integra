import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../config/app.config';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {FiltersService} from '../../../service/filters.service';

@Injectable({
    providedIn: 'root'
  })


export class WorkTimeService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService
    ) {}


    getSubActivityCalender(date = 1, activityIds = null, states = ''): Observable<any> {
        const options = {params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('dateIndex', `${date}`);
        if (states) { options.params =  options.params.set('states', states); }
        if (activityIds) { options.params = options.params.set('activityIds', activityIds);}
        options.params = this.filtersService.getHttpParams(options.params) ;
        return this.http.get<any>(AppConfig.endpoints.getsubactivitycalender, options).pipe(
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