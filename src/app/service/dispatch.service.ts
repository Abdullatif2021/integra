import {Injectable} from '@angular/core';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FiltersService} from './filters.service';
import {PaginationService} from './pagination.service';

@Injectable({
    providedIn: 'root'
})
export class DispatchService {

    constructor(
        private http: HttpClient,
        private filtersService: FiltersService,
        private paginationService: PaginationService
    ) {}

    selectedDispatches = [] ;

    getDispatches(noProgress = false, postmen, order_field = null, order_method = '1', state = 'NOT_PREAPERED') {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        if (noProgress) { options.headers = options.headers.append('ignoreLoadingBar', '');}
        options.params = options.params.set('state', state) ;
        options.params = options.params.set('page', this.paginationService.current_page) ;
        options.params = options.params.set('pageSize', this.paginationService.rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (order_field) {
            options.params = options.params.set('sortKey', order_field) ;
            options.params = options.params.set('orderMethod', order_method) ;
        }
        if (postmen && postmen.items.length) {
            if (postmen.all) {
                options.params = options.params.set('exclude_postmen', postmen.items.toString()) ;
            } else {
                options.params = options.params.set('postmen', postmen.items.toString()) ;
            }
        }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAllSets, options).pipe(
            catchError(this.handleError)
        );
    }

    getCalenderWeeklyDispatches(page, rpp, postmen, revisors, name, order, week = 0, state = 'NOT_PREAPERED', date = null) {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('state', state) ;
        options.params = options.params.set('dateIndex', `${week}`) ;
        options.params = options.params.set('page', page) ;
        options.params = options.params.set('pageSize', rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (postmen || revisors) { options.params = options.params.set('postmen',
            postmen ? postmen.concat(revisors ? revisors : []) : revisors) ; }
        if (name) { options.params = options.params.set('code', name) ; }
        if (date) { options.params = options.params.set('date', date) ; }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCalenderWeeklySets, options).pipe(
            catchError(this.handleError)
        );
    }
    getCalenderDailyDispatches(page, rpp, postmen, revisors, name, order, day, state = 'NOT_PREAPERED', date = null) {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('state', state) ;
        options.params = options.params.set('day', `${day.split('/').reverse().join('-')}`) ;
        options.params = options.params.set('page', page) ;
        options.params = options.params.set('pageSize', rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (date) { options.params = options.params.set('date', date) ; }
        if (postmen || revisors) { options.params = options.params.set('postmen',
            postmen ? postmen.concat(revisors ? revisors : []) : revisors) ; }
        if (name) { options.params = options.params.set('code', name) ; }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCalenderDailySets, options).pipe(
            catchError(this.handleError)
        );
    }

    getCalenderWeeklyPostmen(page, rpp, name, order, week = 0, state = 'NOT_PREAPERED', date = null, type = null) {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('state', state) ;
        options.params = options.params.set('page', page) ;
        options.params = options.params.set('dateIndex', `${week}`) ;
        options.params = options.params.set('pageSize', rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (date) { options.params = options.params.set('date', date) ; }
        if (name) { options.params = options.params.set('name', name) ; }
        if (type) { options.params = options.params.set('type', type) ; }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCalenderWeeklyPostmen, options).pipe(
            catchError(this.handleError)
        );
    }
    getCalenderDailyPostmen(page, rpp, name, order, day, state = 'NOT_PREAPERED', date = null, type = null) {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('state', state) ;
        options.params = options.params.set('page', page) ;
        options.params = options.params.set('day', day.split('/').reverse().join('-')) ;
        options.params = options.params.set('pageSize', rpp) ;
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (date) { options.params = options.params.set('date', date) ; }
        if (name) { options.params = options.params.set('name', name) ; }
        if (type) { options.params = options.params.set('type', type) ; }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCalenderDailyPostmen, options).pipe(
            catchError(this.handleError)
        );
    }

    getAssignedPostmen(page, rpp, name, order, state = 'NOT_PREAPERED') {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = this.filtersService.getHttpParams(options.params) ;
        options.params = options.params.set('page', page) ;
        options.params = options.params.set('pageSize', rpp) ;
        options.params = options.params.set('state', state) ;
        if (name) {
            options.params = options.params.set('name', name) ;
        }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAssignedPostmen, options).pipe(
            catchError(this.handleError)
        );
    }

    getSetDetails(set) {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getSetDetails(set), {}).pipe(
            catchError(this.handleError)
        );
    }

    getAvailableUsers() {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getAvailableUsers, {}).pipe(
            catchError(this.handleError)
        );
    }

    getCalenderAvailablePostmen(day, page = 1, type = null) {
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = options.params.set('page', page + '') ;
        options.params = options.params.set('pageSize', '15') ;
        options.params = options.params.set('day', day.split('/').reverse().join('-'));
        if (type) { options.params = options.params.set('type', type) ; }
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getCalenderAvailablePostmen, options).pipe(
            catchError(this.handleError)
        );
    }

    delete(ids, confirm = false) {
        const data = {
            sets: ids,
            confirm: confirm
        };
        return this.http.post<any>(AppConfig.endpoints.dispatchDelete, data).pipe(
            catchError(this.handleError)
        );
    }

    assignToUser(sets, user) {
        const data = {
            sets: sets,
            user: user
        };
        return this.http.post<any>(AppConfig.endpoints.assignToUser, data).pipe(
            catchError(this.handleError)
        );
    }

    assignToUserByFilters(user) {
        const data = {
            byFilter: 1,
            filters: this.filtersService.getFiltersObject(),
            user: user
        };
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (this.filtersService.specials.postmen && this.filtersService.specials.postmen.items.length) {
            options.params = options.params.set('postmen', this.filtersService.specials.postmen.items);
        }
        return this.http.post<any>(AppConfig.endpoints.assignToUser, data, options).pipe(
            catchError(this.handleError)
        );
    }

    prepare(ids, confirm = false) {
        const data = {
            sets: ids,
            confirm: confirm
        };
        return this.http.post<any>(AppConfig.endpoints.dispatchPrepare, data).pipe(
            catchError(this.handleError)
        );
    }
    prepareWithFilters(confirm) {
        const data = {
            byFilter: 1,
            filters: this.filtersService.getFiltersObject(),
            confirm: confirm
        };
        const options = { params: new HttpParams(), headers: new HttpHeaders()};
        options.params = this.filtersService.getHttpParams(options.params) ;
        if (this.filtersService.specials.postmen && this.filtersService.specials.postmen.items.length) {
            options.params = options.params.set('postmen', this.filtersService.specials.postmen.items);
        }
        return this.http.post<any>(AppConfig.endpoints.dispatchPrepare, data, options).pipe(
            catchError(this.handleError)
        );
    }

    uploadDayAttachment(day, attachment) {
        const formData = new FormData();
        formData.append('file', attachment);
        formData.append('day', day.split('/').reverse().join('-'));
        console.log(attachment, day);
        return this.http.post(AppConfig.endpoints.saveNoteToDay, formData);
    }

    updateDayNote(day, note) {
        const data = {
            day: day.split('/').reverse().join('-'),
            note: note
        };
        return this.http.post(AppConfig.endpoints.saveNoteToDay, data);
    }

    updatePostmanDayNote(postman, day, note) {
        const data = {
            day: day.split('/').reverse().join('-'),
            note: note,
            postman: postman
        };
        return this.http.post(AppConfig.endpoints.updatePostmanDayNote, data);
    }

    addNoteToSet(set, note, type) {
        const data = {
            note: note,
            type: type
        };
        return this.http.post(AppConfig.endpoints.saveNoteToSet(set), data);
    }

    getLog(dispatch) {
        return this.http.get<any>(AppConfig.endpoints.getDispatchLog(dispatch)).pipe(
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
