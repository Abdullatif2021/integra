import {EventEmitter, Injectable} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {ActionsService} from '../../../service/actions.service';
import {DispatchService} from '../../../service/dispatch.service';

@Injectable()
export class DispatchActionsService {

    constructor(
        private actionsService: ActionsService,
        private snotifyService: SnotifyService,
        private dispatchService: DispatchService
    ) {
    }

    reloadData = new EventEmitter();

    deleteDispatch(ids, confirm = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const method = this.dispatchService.delete(ids, confirm);
            this.actionsService.run(method, 'Elimina in corso', (result) => {
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
                resolve(result);
                return 'Distinte Elimina con successo';
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
            this.actionsService.run(method, 'Prepare in corso', (result) => {
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
                resolve(result);
                return 'Distinte Prepared successfully';
            }, (error) => {
                reject(error);
                if (error.statusCode === 421) {
                    return 'La borsa non è preparata deve prima essere abbinata ad un operatore';
                }
                return error.error ? error.error.message : (error.message ? error.message : 'Error');
            });
        });
    }

    uploadDayAttachment(day, attachment) {
        return new Promise<any>((resolve, reject) => {
            const method = this.dispatchService.uploadDayAttachment(day, attachment);
            this.actionsService.run(method, 'Uploading Attachment', (result) => {
                resolve(result);
                return 'Attachment added successfully';
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
            this.actionsService.run(method, 'Assigning sets', (result) => {
                this.reloadData.emit(true);
                resolve(result);
                return 'Set Assigned successfully';
            }, (error) => {
                reject(error);
                return error.error ? error.error.message : (error.message ? error.message : 'Error');
            });
        })
    }

}
