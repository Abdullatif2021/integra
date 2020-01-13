import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackProcessingService {

    constructor() { }
    _states = {} ;
    _handles = {} ;
    _queue = {} ;

    async run(key, action) {
        this._states[key] = 1 ;
        await action(this.getOrCreateHandle(key));
        this._states[key] = false ;
        this._handles[key] = 0 ;
    }

    isRunning(key): boolean {
        return this._states[key] === 1;
    }

    pause(key) {
        return this._states[key] = 2 ;
    }

    getHandle(key): EventEmitter<any> {
        return this._handles[key];
    }

    getOrCreateHandle(key) {
        if (this._handles[key]) {
            return this._handles[key] ;
        }
        return this._handles[key] = new EventEmitter();
    }

    queue(key, item) {
        this._queue[key] = item ;
    }

    release(key) {
        this._queue[key] = null ;
    }

    getWaiting(key) {
        if (typeof this._queue[key] !== 'undefined') {
            return this._queue[key] ;
        }
        return null ;
    }

    checkLeaving() {
        let working = false ;
        Object.values(this._states).forEach((elm: boolean) => {
            working = working || elm ;
        });
        return working ? 'Some processes are working in background, leaving this page will cause them to stop \n' +
            ', are you sure you want to leave ?' : null ;
    }
}
