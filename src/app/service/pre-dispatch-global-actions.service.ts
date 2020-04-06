import {Injectable} from '@angular/core';
import {BackProcessingService} from './back-processing.service';
import {LocatingService} from './locating/locating.service';
import {PlanningService} from './planning/planning.service';
import {SnotifyService} from 'ng-snotify';

@Injectable({
    providedIn: 'root'
})
export class PreDispatchGlobalActionsService {

    constructor(
        private backProcessingService: BackProcessingService,
        private locatingService: LocatingService,
        private planningService: PlanningService,
        private snotifyService: SnotifyService,
    ) {}


    startPreDispatchAction(preDispatchData, data = {}) {
        const action = this.backProcessingService.getPreDispatchAction(preDispatchData.status);
        preDispatchData.localize_status = 'play';
        this.backProcessingService.run(`${action}-${preDispatchData.id}`, async(handle) => {
            if (action === 'locating') {
                await this.runLocating(preDispatchData, handle) ;
            } else if (action === 'planning') {
                await this.runPlanning(preDispatchData, handle, data) ;
            }
        }, action, preDispatchData.id);
    }

    isPreDispatchInRunStatus(preDispatchData): boolean {
        return ['in_localize', 'in_divide', 'drawing_paths'].find((elm) => elm === preDispatchData.status) ? true : false;
    }

    async runPlanning(preDispatchData, handle, data: any = {}) {
        const planningService =  Object.assign(
            Object.create( Object.getPrototypeOf(this.planningService)), this.planningService
        );
        await this.backProcessingService.updatePreDispatchActionStatus(preDispatchData.id, 1);
        let sets: any ;
        if (data.ignoreDivide || preDispatchData.status === 'drawing_paths') {
            sets = await planningService.getSetsWithoutPaths(preDispatchData.id).toPromise();
        } else {
            sets = await planningService.divideToDistenta(preDispatchData.id).toPromise().catch(e => {
                this.backProcessingService.ultimatePause(preDispatchData.id);
                this.snotifyService.error('Something went wrong, check the settings..', {showProgressBar: false,});
            });
        }
        if (sets && sets.data) {
            const drawing: any = await this.planningService.drawPaths(sets.data, preDispatchData, handle);
        }
    }

    async runLocating(preDispatchData, handle) {
        const locatingService =  Object.assign(
            Object.create( Object.getPrototypeOf(this.locatingService)), this.locatingService
        );
        await locatingService.startLocating(preDispatchData.id, handle, preDispatchData, false);
    }
}
