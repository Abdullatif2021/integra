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

  addToPreDispatch(data, preDispatchId, failed: any = null) {

      const products: any = this.productsService.selectedProducts ;
      let method ;
      if (!data.method || data.method === 'selected' ) {
          if (!products || ( typeof products === 'object' && !products.length ) ) {
              return this.snotifyService.error('Nessun prodotto selezionato', { showProgressBar: false, timeout: 3000 });
          }
          const productsIds = [] ;
          products.forEach((elm) => {
              productsIds.push(elm.id) ;
          });
          method = this.preDispatchService.addProductsBySelected(preDispatchId, productsIds);
      } else {
          method = this.preDispatchService.addProductsByFilters(preDispatchId) ;
      }
      this.run(method, 'Aggiunta in corso', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          return 'Prodotti aggiunti con successo' ;
      }, (error) => {
          if (typeof failed === 'function') {
              failed(error);
          }
          if (error && error.statusCode && error.statusCode === 507) {
              setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          }
      } );
  }

  createNewPreDispatch(data, name, failed: any = false, confirm = false, appendData = []) {
      const products: any = this.productsService.selectedProducts ;
      let method ;
      if (!data.method || data.method === 'selected' ) {
          if (!products || ( typeof products === 'object' && !products.length ) ) {
              return this.snotifyService.error('Nessun prodotto selezionato', { showProgressBar: false, timeout: 3000 });
          }
          const productsIds = [] ;
          products.forEach((elm) => {
              productsIds.push(elm.id);
          });
          appendData.forEach((elm) => {
              productsIds.push(elm.id);
          })
          method = this.preDispatchService.createBySelected(name, productsIds, confirm);
      } else {
          method = this.preDispatchService.createByFilters(name, confirm) ;
      }
      this.run(method, 'Creazione Pre-Distinta in corsot', () => {
          setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          if ( typeof data.finish === 'function' ) {
              data.finish() ;
          }
          return 'Pre-distinta Creata con successo' ;
      }, (error) => {
          if (typeof failed === 'function') {
              failed(error);
          }
          if (error && error.statusCode && error.statusCode === 508) {
              this.preDispatchService.showConfirmProductsWithSameInfoShouldBeSelected(
                  {data: error.data, name: name, defaultData: data}
              );
          } else if (error && error.statusCode && error.statusCode === 509) {
              this.preDispatchService.showConfirmProductsShouldBeAddedToPreDispatchWithSameInfo(
                  {data: error.data, name: name, defaultData: data}
              );
          }
          if (error && error.statusCode && error.statusCode === 507) {
              setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
          }
      });

  }

  mergePreDispatches(name) {

      const preDispatches = this.preDispatchService.selectedPreDispatches ;
      if (!preDispatches || ( typeof preDispatches === 'object' && !preDispatches.length)) {
          return this.snotifyService.error('Nessuna predestinata selezionata', { showProgressBar: false, timeout: 3000 });
      }
      const items = [] ;
      preDispatches.forEach((elm) => {
          items.push(elm.id) ;
      });

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

  deletePreDispatch(ids, confirm = false): Promise<any> {
      return new Promise<any>((resolve, reject) => {
          const method = this.preDispatchService.delete(ids, confirm) ;
          this.run(method, 'Elimina in corso', (result) => {
              setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
              resolve(result);
              return 'Pre-Distinte Elimina con successo' ;
          }, (error) => {
              reject(error);
              setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
              return error.error ? error.error.message : (error.message ? error.message : 'Error') ;
          });
      });
  }

}
