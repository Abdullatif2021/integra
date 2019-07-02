import {EventEmitter, Injectable} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {ProductsService} from './products.service';
import {PreDispatchService} from './pre-dispatch.service';
import {promise} from 'selenium-webdriver';
import {ApiResponseInterface} from '../core/models/api-response.interface';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

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

      this.snotifyService.async('Creazione Pre-Distinta in corsot', method, { showProgressBar: true, timeout: 5000 });

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

      this.snotifyService.async('Creazione Pre-Distinta in corsot', method, { showProgressBar: true, timeout: 4000 });

  }


}
