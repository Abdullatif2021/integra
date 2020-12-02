import { TranslateService } from '@ngx-translate/core';
import {EventEmitter, Injectable} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {ActionsService} from '../../../service/actions.service';
import {DispatchService} from '../../../service/dispatch.service';

@Injectable()
export class DispatchActionsService {

    constructor(
        private actionsService: ActionsService,
        private snotifyService: SnotifyService,
        private dispatchService: DispatchService,
        private translate: TranslateService,
        ) {}

    reloadData = new EventEmitter();

    deleteDispatch(ids, confirm = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const method = this.dispatchService.delete(ids, confirm);
            this.actionsService.run(method, this.translate.instant('home.services.dispatch_actions_service.delete'), (result) => {
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
                resolve(result);
                return this.translate.instant('home.services.dispatch_actions_service.success_delete');
            }, (error) => {
                reject(error);
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
                return error.error ? error.error.message : (error.message ? error.message : 'Error');
            });
        });
    }

    prepareDispatch(way, ids, confirm = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let method = null ;
            if (way === 'selected') {
                method = this.dispatchService.prepare(ids, confirm);
            } else {
                method = this.dispatchService.prepareWithFilters(confirm);
            }
            this.actionsService.run(method, this.translate.instant('home.services.dispatch_actions_service.prepare'), (result) => {
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
                resolve(result);
                return this.translate.instant('home.services.dispatch_actions_service.prepare_delete');
            }, (error) => {
                reject(error);
                if (error.statusCode === 421) {
                    return this.translate.instant('home.services.dispatch_actions_service.bag_not_preperd');
                }
                return error.error ? error.error.message : (error.message ? error.message : 'Error');
            });
        });
    }

    uploadDayAttachment(day, attachment) {
        return new Promise<any>((resolve, reject) => {
            const method = this.dispatchService.uploadDayAttachment(day, attachment);
            this.actionsService.run(method, this.translate.instant('home.services.dispatch_actions_service.upload_attachement'),
             (result) => {
                resolve(result);
                return this.translate.instant('home.services.dispatch_actions_service.upload_attachement_success');
            }, (error) => {
                reject(error);
                return error.error ? error.error.message : (error.message ? error.message : 'Error');
            });
        });
    }

    assignToUser(way, user, items = null) {
        return new Promise<any>((resolve, reject) => {
            let method = null;
            if (way === 'selected') {
                method = this.dispatchService.assignToUser(items, user);
            } else {
                method = this.dispatchService.assignToUserByFilters(user);
            }
            this.actionsService.run(method, this.translate.instant('home.services.dispatch_actions_service.assigment'), (result) => {
                this.reloadData.emit(true);
                resolve(result);
                return this.translate.instant('home.services.dispatch_actions_service.assigment_success');
            }, (error) => {
                reject(error);
                return error.error ? error.error.message : (error.message ? error.message : 'Error');
            });
        })
    }

}
