import {EventEmitter, Injectable} from '@angular/core';
import {BackProcessingService} from './back-processing.service';
import {LocatingService} from './locating/locating.service';
import {PlanningService} from './planning/planning.service';
import {SnotifyService} from 'ng-snotify';
import {PreDispatchService} from './pre-dispatch.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class PreDispatchGlobalActionsService {

    constructor(
        private backProcessingService: BackProcessingService,
        private locatingService: LocatingService,
        private planningService: PlanningService,
        private snotifyService: SnotifyService,
        private preDispatchService: PreDispatchService,
        private translate: TranslateService,
        ) {
            translate.setDefaultLang('itly');
        }
    planningErrors = new EventEmitter();
    handles = {} ;
    handleCreated = new EventEmitter();
    modalHandleMessages = new EventEmitter<any>(); // List to this if you are in a modal
    locatingServiceClones = {} ;

    getOrCreateLocatingServiceClone(id) {
        if (this.locatingServiceClones[id]) { return this.locatingServiceClones[id] ; }
        this.locatingServiceClones[id] = Object.assign(
            Object.create( Object.getPrototypeOf(this.locatingService)), this.locatingService
        );
        return this.locatingServiceClones[id];
    }

    modalMessageRecived(message) {
        this.modalHandleMessages.emit(message);
    }

    startPreDispatchAction(preDispatchData, data: any = <any>{}) {
        const action = this.backProcessingService.getPreDispatchAction(preDispatchData.status);
        if (this.backProcessingService.isRunning(`${action}-${preDispatchData.id}`)) {
            return ;
        }
        preDispatchData.localize_status = 'play';
        this.backProcessingService.run(`${action}-${preDispatchData.id}`, async(handle) => {
            if (action === 'locating' || data.force_run === 'locating') {
                await this.runLocating(preDispatchData, handle) ;
            } else if (action === 'planning' || data.force_run === 'planning') {
                await this.runPlanning(preDispatchData, handle, data) ;
            }
            this.handles[preDispatchData.id] = handle ;
            this.handleCreated.emit(handle);
        }, data.force_run ? data.force_run : action, preDispatchData.id);
    }

    isPreDispatchInRunStatus(preDispatchData): boolean {
        return ['in_grouping', 'in_localize', 'in_divide', 'drawing_paths'].find((elm) => elm === preDispatchData.status) ? true : false;
    }

    async runPlanning(preDispatchData, handle, data: any = {}, force = false) {

        const planningService =  Object.assign(
            Object.create( Object.getPrototypeOf(this.planningService)), this.planningService
        );
        await this.backProcessingService.updatePreDispatchActionStatus(preDispatchData.id, 1);
        let sets: any ;
        if (data.ignoreDivide || preDispatchData.status === 'drawing_paths') {
            sets = await planningService.getSetsWithoutPaths(preDispatchData.id).toPromise();
        } else {
            sets = await planningService.divideToDistenta(preDispatchData.id, force).toPromise().catch(e => {
                this.backProcessingService.ultimatePause(preDispatchData.id);
                this.snotifyService.error(this.translate.instant('services.pre_dispatch_global_actions_service.ultimatePause.error'),
                {showProgressBar: false, });
                this.planningErrors.emit('error');
            });
            let checkResult: any = false;
            if (sets.statusCode === 480) {
                // show confirm modal
                checkResult = await this.preDispatchService.showConfirmPlanningModal(preDispatchData.id);
                sets = await planningService.divideToDistenta(preDispatchData.id, checkResult).toPromise().catch(e => {
                    this.backProcessingService.ultimatePause(preDispatchData.id);
                    this.snotifyService.error(this.translate.instant('services.pre_dispatch_global_actions_service.ultimatePause.error'),
                     {showProgressBar: false, });
                    this.planningErrors.emit('error');
                });
            }
            let checkAddProductsResult: any = false ;
            if (sets.statusCode === 510) {
                checkAddProductsResult = await this.preDispatchService
                    .showConfirmPlanningAddProductsModal(preDispatchData.id, sets.data);
                if (!checkAddProductsResult) {
                    this.backProcessingService.ultimatePause(preDispatchData.id);
                    return this.snotifyService.error(this.translate.instant
                        ('services.pre_dispatch_global_actions_service.ultimatePause.error2'),
                    {showProgressBar: false, });
                }
                sets = await planningService.divideToDistenta(preDispatchData.id, checkResult, checkAddProductsResult).toPromise()
                    .catch(e => {
                        this.backProcessingService.ultimatePause(preDispatchData.id);
                        this.snotifyService.error(this.translate.instant
                            ('services.pre_dispatch_global_actions_service.ultimatePause.error'),
                         {showProgressBar: false, });
                        this.planningErrors.emit('error');
                });
            }
        }
        if (sets && sets.data) {
            const drawing: any = await this.planningService.drawPaths(sets.data, preDispatchData, handle);
        }
    }

    async runLocating(preDispatchData, handle) {
        this.backProcessingService.ignoreOne(`locating-${preDispatchData.id}`);
        preDispatchData.localize_status = 'play';
        const locatingService =  this.getOrCreateLocatingServiceClone(preDispatchData.id);
        await locatingService.startLocating(preDispatchData.id, handle, preDispatchData, false);
    }

    fixLocatingItems(data) {
        console.log('data.preDispatch', data.preDispatch);
        const locatingService = this.getOrCreateLocatingServiceClone(data.preDispatch);
        this.backProcessingService.run(`locating-${data.preDispatch}`, async (handle) => {
            await locatingService.fix(data.fixedItems, data.skip, handle, data.preDispatch);
        }, 'fixing', parseInt(data.preDispatch, 10));
    }
}
