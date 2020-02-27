import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {ResultsService} from '../service/results.service';

@Injectable()
export class ResultesResolver implements Resolve<any> {

    constructor(
        private preDispatchService: PreDispatchService,
        private resultsService: ResultsService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise(async (resolve, reject) => {
            const selectedPostmen: any = {} ;
            const scheduleResults: any = await this.resultsService.getScheduleResults(route.parent.params.id);
            scheduleResults.forEach((day) => {
                day.sets.forEach((set) => {
                    if (!selectedPostmen[day.day]) {
                        selectedPostmen[day.day] = <any>{} ;
                    }
                    selectedPostmen[day.day][set.id] = set.postman ;
                });
            });
            resolve({scheduleResults: scheduleResults, selectedPostmen: selectedPostmen});
        });
    }




}
