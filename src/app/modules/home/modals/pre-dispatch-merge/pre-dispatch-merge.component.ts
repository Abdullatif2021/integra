import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';

@Component({
  selector: 'app-pre-dispatch-merge',
  templateUrl: './pre-dispatch-merge.component.html',
  styleUrls: ['./pre-dispatch-merge.component.css']
})
export class PreDispatchMergeComponent extends ModalComponent implements OnInit {

  constructor(
      private actionsService: ActionsService,
      public preDispatchService: PreDispatchService
  ) {
    super();
  }

  name = '' ;
  error = null ;
  confirmed = false ;
  ngOnInit() {
  }

  changeName(event) {
      this.name = event.target.value ;
  }
  confirm() {
      this.confirmed = true ;
  }
  run(modal) {
    if ( !this.name || this.name === '') { return this.error = 1 ; }
    if ( this.name.length < 3 ) { return this.error = 2 ; }

    this.actionsService.mergePreDispatches(this.name) ;
    modal.close();
  }

}
