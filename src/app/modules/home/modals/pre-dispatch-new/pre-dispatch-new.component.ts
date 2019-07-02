import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';

@Component({
  selector: 'app-pre-dispatch-new',
  templateUrl: './pre-dispatch-new.component.html',
  styleUrls: ['./pre-dispatch-new.component.css']
})
export class PreDispatchNewComponent extends ModalComponent  implements OnInit {

  constructor(
      private actionsService: ActionsService
  ) {
      super();
  }

  name = '' ;
  error: any = false ;

  ngOnInit() {
  }

  changeName(event) {
    this.name = event.target.value ;
  }

  run(modal) {
    if ( !this.name || this.name === '' ) { return this.error = 1; }
    this.actionsService.createNewPreDispatch(this.data, this.name) ;
    modal.close();
  }

}