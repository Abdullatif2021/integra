import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {catchError} from 'rxjs/operators';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {LocatingService} from './locating/locating.service';

@Injectable({
    providedIn: 'root'
})
export class BackProcessingService {

    constructor(
        private http: HttpClient,
    ) { }
    _states = {} ;
    _actions = {} ;
    _handles = {} ;
    _ignore_one = {} ;
    // _queue = {} ;

    async run(key, action, namespace = 'general', id = -1) {
        if (this._actions[namespace]) {
            this._actions[namespace].push(id) ;
        } else {
            this._actions[namespace] = [id] ;
        }
        this._states[key] = 1 ;
        this._ignore_one[namespace] = true ;
        const result = await action(this.getOrCreateHandle(key));
        this._states[key] = false ;
        this._handles[key] = 0 ;
        this._actions[namespace] = this._actions[namespace].filter((elm) => elm !== id) ;
        return result ;
    }

    isRunning(key): boolean {
        return this._states[key] === 1;
    }

    isRunningAny(id): boolean {
        const operations = Object.keys(this._states);
        for (let i = 0; i < operations.length; ++i) {
            const _operation = operations[i].split('-');
            if (_operation.length === 2 && _operation[1] == id && this._states[operations[i]] === 1) {
                return true ;
            }
        }
        return false ;
    }

    pause(key) {
        return this._states[key] = 2 ;
    }

    async ultimatePause(id) {
        Object.keys(this._states).forEach((operation) => {
            const _operation = operation.split('-');
            if (_operation.length === 2 && _operation[1] == id) {
                this._states[operation] = 2 ;
            }
        });
        return await this.updatePreDispatchActionStatus(id, null);
    }

    getOrCreateHandle(key) {
        if (this._handles[key]) {
            return this._handles[key] ;
        }
        return this._handles[key] = new EventEmitter();
    }

    getAllByNameSpace(namespace) {
        return this._actions[namespace];
    }

    nameSpaceHasAny(namespace): boolean {
        return this._actions[namespace] && this._actions[namespace].length ;
    }

    ignoreOne(namespace): boolean {
        const state = this._ignore_one[namespace] ? true : false ;
        if (this._ignore_one[namespace]) {
            this._ignore_one[namespace] = false ;
        }
        return state;
    }

    // updateLocalizationStatus
    async updatePreDispatchActionStatus(id, status) {
        return await this.run('updating-status-' + id, () => new Promise((resolve, reject) => {
            const options = { params: new HttpParams(), headers: new HttpHeaders({'ignoreLoadingBar': ''})};
            if (status) {
                options.params = options.params.append('status', status);
            }
            return this.http.get<ApiResponseInterface>(AppConfig.endpoints.updatePreDispatchRunningStatus(id), options).subscribe(
                data => { resolve(data); },
                error => { reject(error); },
            );
        }), 'updating-status', id);
    }

    checkLeaving() {
        let working = false ;
        Object.values(this._states).forEach((elm: boolean) => {
            working = working || elm ;
        });
        return working ? 'Some processes are working in background, leaving this page will cause them to stop \n' +
            ', are you sure you want to leave ?' : null ;
    }

    /***  Pre-Dispatch {  ***/
    getPreDispatchAction(status) {
        if (['notPlanned', 'in_grouping', 'in_localize'].find((item) => item === status)) {
            return 'locating';
        }
        if (status === 'inPlanning' || status === 'in_divide' || status === 'drawing_paths') {
            return 'planning';
        }
    }

    handlePreDispatchActionsChanges(preDispatchData) {
        const action = this.getPreDispatchAction(preDispatchData.status);
        if (
            // TODO change localize_status to the new status name.
            preDispatchData.localize_status === 'pause' &&
            this.isRunning(`${action}-${preDispatchData.id}`)
            && !this.nameSpaceHasAny('updating-status')
        ) {
            // pause pre-dispatch
            this.pause(`${action}-` + preDispatchData.id);
            // this.backProcessingService.updatePreDispatchActionStatus(preDispatchData.id, null);
        }
    }

    /*** } Pre-Dispatch ***/


    // //TODO Remove this later.
    // queue(key, item) {
    //     this._queue[key] = item ;
    // }
    //
    // release(key) {
    //     this._queue[key] = null ;
    // }
    //
    // getWaiting(key) {
    //     if (typeof this._queue[key] !== 'undefined') {
    //         return this._queue[key] ;
    //     }
    //     return null ;
    // }
    // getHandle(key): EventEmitter<any> {
    //     return this._handles[key];
    // }
}
