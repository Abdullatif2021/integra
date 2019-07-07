import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntegraaModalService {

  status = new EventEmitter() ;
  constructor() { }


  open(url, options) {
    options.url = url ;
    this.status.emit(options) ;
    return this ;
  }

}
