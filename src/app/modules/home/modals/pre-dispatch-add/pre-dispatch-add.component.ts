import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {ActionsService} from '../../../../service/actions.service';

@Component({
  selector: 'app-pre-dispatch-add',
  templateUrl: './pre-dispatch-add.component.html',
  styleUrls: ['./pre-dispatch-add.component.css']
})

export class PreDispatchAddComponent extends ModalComponent implements OnInit {

  options = [
      {name: 'Il nome della Pre-distinta', value: 'name'},
      {name: 'N° della Predistinta', value: 'code'}
  ];

  bindLabel = 'name' ;
  preDispatches: any = [] ;
  selected = null ;
  error: any = false ;

  constructor(
      private preDispatchService: PreDispatchService,
      private actionsService: ActionsService,
  ) {
    super();
  }

  ngOnInit() {
    this.preDispatchService.getPreDispatchList().subscribe((res: ApiResponseInterface) => {
      if (res.status === 'success') {
        this.preDispatches = res.data ;
        console.log(this.preDispatches);
      }
    });
  }

  changeBindLabel(event) {
    this.bindLabel = event.value ;
  }

  select(item) {
    this.error = false ;
    this.selected = item ? item.id : null;
  }

  run(modal) {
    if (!this.selected) { return this.error = 1 ; }
    this.actionsService.addToPreDispatch(this.data, this.selected) ;
    modal.close();
  }
}
