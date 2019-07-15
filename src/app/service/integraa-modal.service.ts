import {ComponentFactoryResolver, EventEmitter, Injectable} from '@angular/core';
import {ModalDirective} from '../shared/directives/modal.directive';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class IntegraaModalService {

  status = new EventEmitter() ;
  constructor(

  ) { }


  open(url, options) {
    options.url = url ;
    this.status.emit(options) ;
    return this ;
  }


}
