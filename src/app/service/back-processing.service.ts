import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BackProcessingService {

    constructor() { }
    _states = {} ;
    _handles = {} ;

    async run(key, action) {
        this._states[key] = true ;
        this._handles[key] = {} ;
        await action(this._handles[key]);
        this._states[key] = false ;

    }

    isRunning(key): boolean {
        // console.log(this._handles[key]);
        return this._states[key] ? true : false ;
    }

    checkLeaving() {
        let working = false ;
        Object.values(this._states).forEach((elm: boolean) => {
            console.log('here we go', elm);
            working = working || elm ;
        });
        return working ? 'Some processes are working in background, leaving this page will cause them to stop \n' +
            ', are you sure you want to leave ?' : null ;
    }
}
