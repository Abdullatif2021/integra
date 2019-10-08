import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';

@Component({
  selector: 'app-pre-dispach-edit',
  templateUrl: './pre-dispatch-edit.component.html',
  styleUrls: ['./pre-dispatch-edit.component.css']
})
export class PreDispatchEditComponent extends ModalComponent implements OnInit {

  constructor(private actionsService: ActionsService) {
      super();
  }

  name = '' ;
  error = null ;

  ngOnInit() {
  }

  changeName(event) {
      this.name = event.target.value ;
  }

  run(modal) {
      if ( !this.name || this.name === '') { return this.error = 1 ; }
      if ( this.name.length < 3 ) { return this.error = 2 ; }

      this.actionsService.editPreDispatch(this.name, this.data.id) ;
      modal.close();
  }
}