import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';

@Component({
  selector: 'app-pwsisbs-confirm-modal',
  templateUrl: './pwsisbs-confirm-modal.component.html',
  styleUrls: ['./pwsisbs-confirm-modal.component.css']
})
export class PwsisbsConfirmModalComponent extends ModalComponent implements OnInit {

  constructor(
      private actionsService: ActionsService,
  ) {
      super();
  }

  data: any

  ngOnInit() {
  }

  runContinue(modal) {
      modal.close();
      this.actionsService.createNewPreDispatch(this.data.defaultData, this.data.name, (error) => {
      }, true) ;
  }

  // addThenContinue(modal) {
  //     modal.close();
  //     this.actionsService.createNewPreDispatch(this.data.defaultData, this.data.name, (error) => {
  //     }, true, this.data.data) ;
  // }

}
