import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {catchError} from 'rxjs/operators';
import {ApiResponseInterface} from '../core/models/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class BackProcessingService {

    constructor() { }
    _states = {} ;
    _actions = {} ;
    _handles = {} ;
    // _queue = {} ;

    async run(key, action, namespace = 'general', id = -1) {
        if (this._actions[namespace]) {
            this._actions[namespace].push(id) ;
        } else {
            this._actions[namespace] = [id] ;
        }
        this._states[key] = 1 ;
        await action(this.getOrCreateHandle(key));
        this._states[key] = false ;
        this._handles[key] = 0 ;
        this._actions[namespace] = this._actions[namespace].filter((elm) => elm !== id) ;
    }

    isRunning(key): boolean {
        return this._states[key] === 1;
    }

    pause(key) {
        return this._states[key] = 2 ;
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

    checkLeaving() {
        let working = false ;
        Object.values(this._states).forEach((elm: boolean) => {
            working = working || elm ;
        });
        return working ? 'Some processes are working in background, leaving this page will cause them to stop \n' +
            ', are you sure you want to leave ?' : null ;
    }

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
