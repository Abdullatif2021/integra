import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {BackProcessingService} from '../../../../service/back-processing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pre-dispatch-delete',
  templateUrl: './pre-dispatch-delete.component.html',
  styleUrls: ['./pre-dispatch-delete.component.css']
})
export class PreDispatchDeleteComponent extends ModalComponent implements OnInit {

  constructor(
      private actionsService: ActionsService,
      private preDispatchService: PreDispatchService,
      private backProcessingService: BackProcessingService,
      private modalService: NgbModal
  ) {
      super();
  }

  error = null ;
  items = [] ;
  unDeletedItems = [] ;

  ngOnInit() {
    if (this.data.deleteItem) {
      this.items = [this.data.item];
    } else {
      this.items = this.preDispatchService.selectedPreDispatches ;
    }
  }
  async run(modal, confirmModal) {
    const ids = [] ;
    this.items.forEach((item) => {
      ids.push(item.id) ;
    });
    modal.close();
    await this.actionsService.deletePreDispatch(ids, false).catch((error) => {
      this.unDeletedItems = error.data ;
      this.modalService.open(confirmModal);
    });
  }
  async runConfirm(modal) {
    const ids = [] ;
    this.unDeletedItems.forEach((item) => {
      ids.push(item.id) ;
    });
    this.actionsService.deletePreDispatch(ids, true);
    modal.close();
  }
  canDeleteNow() {
    for (let i = 0; i < this.items.length; ++i) {
        if (this.backProcessingService.isRunning('locating-' + this.items[i].id)) {
            return false ;
        }
    }
    return true ;
  }

}
