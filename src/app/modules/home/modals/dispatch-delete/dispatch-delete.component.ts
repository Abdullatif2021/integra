import { Component, OnInit } from '@angular/core';
import {DispatchService} from '../../../../service/dispatch.service';
import {DispatchActionsService} from '../../service/dispatch-actions.service';
import {ModalComponent} from '../modal.component';

@Component({
  selector: 'app-dispatch-delete',
  templateUrl: './dispatch-delete.component.html',
  styleUrls: ['./dispatch-delete.component.css']
})
export class DispatchDeleteComponent extends ModalComponent implements OnInit {

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
      await this.dispatchActionsService.deleteDispatch(this.items.map(item => item.id));
  }

}
