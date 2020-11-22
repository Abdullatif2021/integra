import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {PreDispatchActionsService} from '../../service/pre-dispatch-actions.service';
import {OwnTranslateService} from './../../../../service/translate.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-pre-dispatch-merge',
  templateUrl: './pre-dispatch-merge.component.html',
  styleUrls: ['./pre-dispatch-merge.component.css']
})
export class PreDispatchMergeComponent extends ModalComponent implements OnInit {

  constructor(
      private preDispatchActionsService: PreDispatchActionsService,
      public preDispatchService: PreDispatchService,
      private translate: TranslateService,
  ) {
    super();
    translate.setDefaultLang('itly');
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

    this.preDispatchActionsService.mergePreDispatches(this.name) ;
    modal.close();
  }

}
