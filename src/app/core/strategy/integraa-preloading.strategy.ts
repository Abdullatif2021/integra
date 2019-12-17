import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {PreloadingStrategy, Route, Router} from '@angular/router';

@Injectable()
export class IntegraaPreloadingStrategy implements PreloadingStrategy {


    constructor(private router: Router) {}

    preload(route: Route, load: () => Observable<any>): Observable<any> {

        if (route.data && route.data['preload'] && route.data['preload'] === this.router.url) {
            return load();
        } else {
            return of(null);
        }
    }

};