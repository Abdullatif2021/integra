import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {ResultsService} from '../service/results.service';
import {SnotifyService} from 'ng-snotify';
import {PreDispatchGlobalActionsService} from '../../../service/pre-dispatch-global-actions.service';
import {takeUntil} from 'rxjs/internal/operators';

@Injectable()
export class ResultesResolver implements Resolve<any> {

    constructor(
        private preDispatchService: PreDispatchService,
        private resultsService: ResultsService,
        private snotifyService: SnotifyService,
        private preDispatchGlobalActionsService: PreDispatchGlobalActionsService

    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise(async (resolve, reject) => {
            const selectedPostmen: any = {} ;
            try {
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
            } catch (e) {
                this.snotifyService.error(
                    `${e.message}, Would you like to continue the planning process ?`,
                    {
                        position: 'centerTop',
                        showProgressBar: false,
                        type: 'confirm',
                        timeout: 6000,
                        buttons: [
                            {text: 'No', action: (toast) => {
                                this.snotifyService.remove(toast.id);
                            }},
                            {text: 'Yes', action: async(toast) => {
                                this.snotifyService.remove(toast.id);
                                const data = await this.preDispatchService.getPreDispatchData(route.parent.params.id).toPromise()
                                if (data.data) {
                                    this.preDispatchGlobalActionsService.startPreDispatchAction(data.data);
                                }
                            }},
                        ]
                    });
                reject(e);
            };
        });
    }




}
