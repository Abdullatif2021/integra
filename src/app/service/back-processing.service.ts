import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {takeUntil} from 'rxjs/internal/operators';

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
    _end_informers = {};
    globalMessenger = new EventEmitter();
    // _queue = {} ;
    blockingMessage = null ;
    async run(key, action, namespace = 'general', id = -1) {
        if (this._actions[namespace]) {
            this._actions[namespace].push(id) ;
        } else {
            this._actions[namespace] = [id] ;
        }
        this._states[key] = 1 ;
        const handle = this.getOrCreateHandle(key) ;
        this.stayOnTouch(handle, key, id); // Inform iframes about changes
        const result = await action(handle);
        this.forgetAbout(key); // job is done, unsubscribe to the handle
        this._states[key] = false ;
        this._handles[key] = 0 ;
        this._actions[namespace] = this._actions[namespace].filter((elm) => elm !== id) ;
        return result ;
    }

    stayOnTouch(handle, key, id) {
        this._end_informers[key] = new EventEmitter();
        handle.pipe(takeUntil(this._end_informers[key])).subscribe(data => {
            this.globalMessenger.emit({key: key, id: id, message: data});
        });
    }

    forgetAbout(key) {
        setTimeout(() => {
            this._end_informers[key].next();
            this._end_informers[key].complete();
        });
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

    ignoreOne(key) {
        this._ignore_one[key] = true ;
    }

    canUpdateState(key): boolean {
        const state = this._ignore_one[key] ? true : false ;
        if (this._ignore_one[key]) {
            this._ignore_one[key] = false ;
        }
        return !state ;
    }

    // updateLocalizationStatus
    async updatePreDispatchActionStatus(id, status) {
        this.ignoreOne('updating-status');
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
        if (status === 'inPlanning' || status === 'in_divide' || status === 'drawing_paths' || status === 'localized') {
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
            && this.canUpdateState(`${action}-${preDispatchData.id}`)
        ) {
            // pause pre-dispatch
            console.log('yes Im firing it');
            this.pause(`${action}-` + preDispatchData.id);
            // this.backProcessingService.updatePreDispatchActionStatus(preDispatchData.id, null);
        }
    }

    hasAnythingBlocking() {
        return this.blockingMessage ;
    }

    blockExit(message) {
        this.blockingMessage = message;
    }

    unblockExit() {
        this.blockingMessage = null ;
    }

    /*** } Pre-Dispatch ***/
}
