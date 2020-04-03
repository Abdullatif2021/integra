import {Injectable} from '@angular/core';
import {BackProcessingService} from './back-processing.service';
import {LocatingService} from './locating/locating.service';
import {PlanningService} from './planning/planning.service';

@Injectable({
    providedIn: 'root'
})
export class PreDispatchGlobalActionsService {

    constructor(
        private backProcessingService: BackProcessingService,
        private locatingService: LocatingService,
        private planningService: PlanningService
    ) {}


    startPreDispatchAction(preDispatchData) {
        const action = this.backProcessingService.getPreDispatchAction(preDispatchData.status);
        preDispatchData.localize_status = 'play';
        this.backProcessingService.run(`${action}-${preDispatchData.id}`, async(handle) => {
            if (action === 'locating') {
                await this.runLocating(preDispatchData, handle) ;
            } else if (action === 'planning') {
                await this.runPlanning(preDispatchData, handle) ;
            }
        }, action, preDispatchData.id);
    }

    isPreDispatchInRunStatus(preDispatchData): boolean {
        return ['in_localize', 'inPlanning', 'drawing_paths'].find((elm) => elm === preDispatchData.status) ? true : false;
    }

    async runPlanning(preDispatchData, handle) {
        const planningService =  Object.assign(
            Object.create( Object.getPrototypeOf(this.planningService)), this.planningService
        );
        await this.backProcessingService.updatePreDispatchActionStatus(preDispatchData.id, 1);
        const sets: any = await planningService.divideToDistenta(preDispatchData.id).toPromise();
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
