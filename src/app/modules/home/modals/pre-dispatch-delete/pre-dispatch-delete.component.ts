import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';

@Component({
  selector: 'app-pre-dispatch-delete',
  templateUrl: './pre-dispatch-delete.component.html',
  styleUrls: ['./pre-dispatch-delete.component.css']
})
export class PreDispatchDeleteComponent extends ModalComponent implements OnInit {

  constructor(
      private actionsService: ActionsService,
      private preDispatchService: PreDispatchService
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
}
