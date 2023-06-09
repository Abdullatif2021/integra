import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {ActionsService} from '../../../../service/actions.service';
import {SnotifyService} from 'ng-snotify';
import {PreDispatchActionsService} from '../../service/pre-dispatch-actions.service';

@Component({
  selector: 'app-psbatpdwsi-confirm-modal',
  templateUrl: './psbatpdwsi-confirm-modal.component.html',
  styleUrls: ['./psbatpdwsi-confirm-modal.component.css']
})
export class PsbatpdwsiConfirmModalComponent extends ModalComponent implements OnInit {

  constructor(
      private preDispatchActionsService: PreDispatchActionsService,
      private snotifyService: SnotifyService,
  ) {
      super();
  }

  data: any;
  ngOnInit() {
  }

  addToPreDispatch(modal) {
      modal.close();
      console.log(this.data);
      if (!this.data.data[0]) {
          this.snotifyService.error('Something went wrong', { showProgressBar: false, timeout: 3000 });
      }
      this.preDispatchActionsService.createNewPreDispatch(this.data.defaultData, this.data.name, (error) => {
      }, true, [], this.data.data[0].id) ;
  }
}
