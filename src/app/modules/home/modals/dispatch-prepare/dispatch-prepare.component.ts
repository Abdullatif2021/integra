import {Component, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {DispatchActionsService} from '../../service/dispatch-actions.service';
import {DispatchService} from '../../../../service/dispatch.service';

@Component({
    selector: 'app-dispatch-prepare',
    templateUrl: './dispatch-prepare.component.html',
    styleUrls: ['./dispatch-prepare.component.css']
})
export class DispatchPrepareComponent extends ModalComponent implements OnInit {

    items = [];

    constructor(
        private dispatchService: DispatchService,
        private dispatchActionsService: DispatchActionsService
    ) {
        super();
    }

    ngOnInit() {
        this.items = this.dispatchService.selectedDispatches;
    }

    async run(modal) {
        modal.close();
        await this.dispatchActionsService.prepareDispatch(this.items.map(item => item.id));
    }

}
