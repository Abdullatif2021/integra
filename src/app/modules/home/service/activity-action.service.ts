import { TranslateService } from '@ngx-translate/core';
import {EventEmitter, Injectable} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {ActionsService} from '../../../service/actions.service';
import {ActivitiessService} from '../modules/activities/service/activities.service';
import {FiltersService} from '../../../service/filters.service';

@Injectable()
export class ActivityActionsService {

    constructor(
        private actionsService: ActionsService,
        private snotifyService: SnotifyService,
        public filtersService: FiltersService,
        private activitiessService: ActivitiessService,
        private translate: TranslateService,
        ) {}

    reloadData = new EventEmitter();

    deleteActivity(ids, confirm = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const method = this.activitiessService.delete(ids, confirm) ;
            this.actionsService.run(method, this.translate.instant('home.services.activity_actions_service.act_delet'), (result) => {
                setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
                resolve(result);
                return this.translate.instant('home.services.activity_actions_service.act_delet_suc') ;
            }, (error) => {
                reject(error);
                setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
                return error.error ? error.error.message : (error.message ? error.message : 'Error') ;
            });
        });
    }



}