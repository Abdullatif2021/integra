import {ComponentFactoryResolver, EventEmitter, Injectable} from '@angular/core';
import {ModalDirective} from '../shared/directives/modal.directive';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class IntegraaModalService {

  status = new EventEmitter() ;
  modals = [] ;
  constructor(

  ) { }


  open(url, options, data) {
    options.url = url ;
    options.data = data ;
    this.status.emit(options) ;
    return this ;
  }

  updateModals(modals) {
    this.modals = modals;
  }


}
