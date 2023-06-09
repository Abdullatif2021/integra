import {Component, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {BackProcessingService} from '../../../../service/back-processing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PreDispatchActionsService} from '../../service/pre-dispatch-actions.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';

@Component({
    selector: 'app-pre-dispatch-delete',
    templateUrl: './pre-dispatch-delete.component.html',
    styleUrls: ['./pre-dispatch-delete.component.css']
})
export class PreDispatchDeleteComponent extends ModalComponent implements OnInit {

    constructor(
        private preDispatchActionsService: PreDispatchActionsService,
        private preDispatchService: PreDispatchService,
        private backProcessingService: BackProcessingService,
        private modalService: NgbModal,
        private translate: TranslateService,
        private translateSelectorService: TranslateSelectorService,

        ) {
          super();
          this.translateSelectorService.setDefaultLanuage();
        }
    error = null;
    items = [];
    needsToConfirmPreDispatches = [];
    runningPreDispatches = [];
    products_with_errors = [];

    ngOnInit() {

        if (this.data.deleteItem) {
            this.items = [this.data.item];
        } else {
            this.items = this.preDispatchService.selectedPreDispatches;
        }

    }


    async run(modal, confirmModal, hasSomeRunningItemsModal) {
        const ids = [];
        this.items.forEach((item) => {
            ids.push(item.id);
        });
        modal.close();
        // send the soft delete request
        await this.preDispatchActionsService.deletePreDispatch(ids, false).catch((res) => {
            // re-init data, it's not needed but just to make sure.
            this.runningPreDispatches = [];
            this.needsToConfirmPreDispatches = [];
            // if the result status code was not 200 (OK), check what's wrong
            if (res.statusCode !== 200 && res.data) {
                res.data.forEach(item => {

                    // if the item code was 302, it means that the server says the this preDispatch is currently running.
                    if (item.code === 301) {
                        this.runningPreDispatches.push(item.preDispatch); // add the preDispatch to runningPreDispatches list
                    } else if (item.code === 302) {
                        // if the item code is 301, it means that this pre-dispatch contains products that can not be deleted.
                        // add the preDispatch, to needsToConfirmPreDispatches list.
                        this.needsToConfirmPreDispatches.push(item.preDispatch);
                    }
                });
            }

            // check if there is any item is running and can't be deleted.
            if (this.runningPreDispatches.length) {
                this.modalService.open(hasSomeRunningItemsModal); // if so, show a message.
            } else if (this.needsToConfirmPreDispatches.length) {
                // if there was no items that is running, but there was items that can't be deleted.
                this.modalService.open(confirmModal); // show the confirmModal modal
            }
        });
    }

    async runConfirm(modal) {
        const ids = [];
        this.needsToConfirmPreDispatches.forEach((item) => {
            ids.push(item.id);
        });
        this.preDispatchActionsService.deletePreDispatch(ids, true);
        modal.close();
    }

    runConfirmNotDeletablePreDispatches(modal, confirmModal) {
        if (this.needsToConfirmPreDispatches.length) {
            this.modalService.open(confirmModal);
        }
        modal.close();
    }


    canDeleteNow() {
        for (let i = 0; i < this.items.length; ++i) {
            if (this.backProcessingService.isRunning('locating-' + this.items[i].id)) {
                return false;
            }
        }
        return true;
    }

}
