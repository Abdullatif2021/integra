import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {BackProcessingService} from '../../../../service/back-processing.service';

@Component({
  selector: 'app-pre-dispatch-delete',
  templateUrl: './pre-dispatch-delete.component.html',
  styleUrls: ['./pre-dispatch-delete.component.css']
})
export class PreDispatchDeleteComponent extends ModalComponent implements OnInit {

  constructor(
      private actionsService: ActionsService,
      private preDispatchService: PreDispatchService,
      private backProcessingService: BackProcessingService
  ) {
      super();
  }

  error = null ;
  items = [] ;
  ngOnInit() {
    if (this.data.deleteItem) {
      this.items = [this.data.item];
    } else {
      this.items = this.preDispatchService.selectedPreDispatches ;
    }
  }

  run(modal) {
    const ids = [] ;
    this.items.forEach((item) => {
      ids.push(item.id) ;
    })
    this.actionsService.deletePreDispatch(ids);
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
