import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../config/app.config';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {FiltersService} from '../../../service/filters.service';

@Injectable({
    providedIn: 'root'
})
export class CalenderService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService
    ) {
    }


    getWeeklyCalender(week = 1, sets = null, postmen = null, date = null, state = 'NOT_PREAPERED'): Observable<any> {
        const options = {params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('dateIndex', `${week}`);
        if (sets) { options.params = options.params.set('sets', sets); }
        if (postmen) { options.params = options.params.set('postmen', postmen); }
        if (date) { options.params = options.params.set('date', date); }
        if (state) { options.params =  options.params.set('state', state); }
        options.params = this.filtersService.getHttpParams(options.params) ;
        return this.http.get<any>(AppConfig.endpoints.getWeeklyCalender, options).pipe(
            catchError(this.handleError)
        );
    }

    getDate(strDate, step) {
        const date = new Date(strDate.split('/').reverse().join('-'));
        date.setDate(date.getDate() + step);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
