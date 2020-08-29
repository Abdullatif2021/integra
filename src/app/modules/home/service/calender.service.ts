import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../config/app.config';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CalenderService {

    constructor(
        private http: HttpClient,
    ) {
    }


    getWeeklyCalender(sets = null, postmen = null): Observable<any> {
        const options = {params: new HttpParams(), headers: new HttpHeaders()};
        if (sets) {
            options.params = options.params.set('sets', sets);
        }
        if (postmen) {
            options.params = options.params.set('postmen', postmen);
        }
        return this.http.get<any>(AppConfig.endpoints.getWeeklyCalender, options).pipe(
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
