import {EventEmitter, Injectable} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {ProductsService} from './products.service';
import {PreDispatchService} from './pre-dispatch.service';
import {ApiResponseInterface} from '../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(
      private snotifyService: SnotifyService,
      private productsService: ProductsService,
      private preDispatchService: PreDispatchService
  ) { }
  actionsChanges = new EventEmitter<number>() ;
  actions = [] ;

  setActions(actions) {
    this.actions = actions ;
    this.actionsChanges.emit(actions);
  }

  run(method, msg, success, failed) {
      const promise = new Promise(function(resolve, reject) {
          method.subscribe(
              data => {
                  if (data.status === 'success' || data.success === true) {
                      let body = data.message ? data.message : 'Success' ;
                      if (typeof success === 'function') {
                          const _msg = success(data);
                          body = _msg ? _msg : body;
                      }
                      resolve({body: body, config: { showProgressBar: false, timeout: 3000 }});
                  } else {
                      let body = data.message ? data.message : 'Error' ;
                      if (typeof failed === 'function') {
                          const _msg = failed(data);
                          body = _msg ? _msg : body ;
                      }
                      if (data.statusCode === 507) {
                          body = 'Questi prodotti sono stati già usati in un\'altra pre-distinta';
                      }
                      reject({body: body, config: { showProgressBar: false, timeout: 3000 }});
                  }
              },
              error => {
                  let body = (error.error && error.error.message) ? error.error.message :
                      (error.msg ? error.msg : (error.message ? error.message : 'Error'));
                  if (typeof failed === 'function') {
                      const _msg = failed(error);
                      body = _msg ? _msg : body ;
                  }
                  reject({body: body, config: { showProgressBar: false, timeout: 3000 }});
              }
          );
      });
      this.snotifyService.async(msg, promise, { showProgressBar: true, timeout: 10000 });
  }

}
