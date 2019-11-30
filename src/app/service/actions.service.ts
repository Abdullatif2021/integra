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
  reloadData = new EventEmitter();

  setActions(actions) {
    this.actions = actions ;
    this.actionsChanges.emit(actions);
  }

  run(method, msg, success, failed) {
      const promise = new Promise(function(resolve, reject) {
          method.subscribe(
              data => {
                  if (data.status === 'success') {
                      let body = 'Success' ;
                      if (typeof success === 'function') {
                          body = success(data);
                      }
                      resolve({body: body, config: { showProgressBar: false, timeout: 3000 }});
                  } else {
                      resolve({body: data.status, config: { showProgressBar: false, timeout: 3000 }});
                  }
              },
              error => {
                  let body = error.msg ? error.msg : 'Error' ;
                  if (typeof failed === 'function') {
                      body = failed(error) ;
                  }
                  reject({body: body, config: { showProgressBar: false, timeout: 3000 }});
              }
          );
      });
      this.snotifyService.async(msg, promise, { showProgressBar: true, timeout: 10000 });
  }

  addToPreDispatch(data, preDispatchId) {

      const products: any = this.productsService.selectedProducts ;
      let method ;
      if (!data.method || data.method === 'selected' ) {
          if (!products || ( typeof products === 'object' && !products.length ) ) {
              return this.snotifyService.error('No Products Selected', { showProgressBar: false, timeout: 3000 });
          }
          const productsIds = [] ;
          products.forEach((elm) => {
              productsIds.push(elm.id) ;
          });
          method = this.preDispatchService.addProductsBySelected(preDispatchId, productsIds);
      } else {
          method = this.preDispatchService.addProductsByFilters(name) ;
      }
      this.run(method, 'Aggiunta in corso', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          return 'Prodotti aggiunti con successo' ;
      }, (error) => error.error.message );
  }

  createNewPreDispatch(data, name) {

      const products: any = this.productsService.selectedProducts ;
      let method ;
      if (!data.method || data.method === 'selected' ) {
          if (!products || ( typeof products === 'object' && !products.length ) ) {
              return this.snotifyService.error('No Products Selected', { showProgressBar: false, timeout: 3000 });
          }
          const productsIds = [] ;
          products.forEach((elm) => {
              productsIds.push(elm.id) ;
          });
          method = this.preDispatchService.createBySelected(name, productsIds);
      } else {
          method = this.preDispatchService.createByFilters(name) ;
      }
      this.run(method, 'Creazione Pre-Distinta in corsot', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          if ( typeof data.finish === 'function' ) {
              data.finish() ;
          }
          return 'Pre-distinta Creata con successo' ;
      }, (error) => error.error.message );

  }

  mergePreDispatches(name) {

      const preDispatches = this.preDispatchService.selectedPreDispatches ;
      if (!preDispatches || ( typeof preDispatches === 'object' && !preDispatches.length)) {
          return this.snotifyService.error('No Pre-Distinta Selected', { showProgressBar: false, timeout: 3000 });
      }
      const items = [] ;
      preDispatches.forEach((elm) => {
          items.push(elm.id) ;
      })

      const method = this.preDispatchService.merge(items, name) ;
      this.run(method, 'Unione in corso', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          return 'Pre-Distinte uniti con successo' ;
      }, (error) => error.error.message );
  }

  editPreDispatch(name, id) {
      const method = this.preDispatchService.edit(id, name) ;
      this.run(method, 'Edit in corso', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          return 'Pre-Distinte Edit con successo' ;
      }, (error) => error.error.message );
  }

  deletePreDispatch(ids) {
      const method = this.preDispatchService.delete(ids) ;
      this.run(method, 'Elimina in corso', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          return 'Pre-Distinte Elimina con successo' ;
      }, (error) => error.error.message );
  }

}
