import {EventEmitter, Injectable} from '@angular/core';
import {ProductsService} from '../../../service/products.service';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {SnotifyService} from 'ng-snotify';
import {ActionsService} from '../../../service/actions.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PreDispatchActionsService {

    constructor(
        private actionsService: ActionsService,
        private snotifyService: SnotifyService,
        private productsService: ProductsService,
        private preDispatchService: PreDispatchService,
        private translate: TranslateService,
        ) {
          translate.setDefaultLang('itly');
        }

    reloadData = new EventEmitter();

    addToPreDispatch(data, preDispatchId, failed: any = null) {

        const products: any = this.productsService.selectedProducts;
        let method;
        if (!data.method || data.method === 'selected') {
            if (!products || (typeof products === 'object' && !products.length)) {
                return this.snotifyService.error(this.translate.instant('home.services.pre_dispatch_actions_service.error'),
                 {showProgressBar: false, timeout: 3000});
            }
            const productsIds = [];
            products.forEach((elm) => {
                productsIds.push(elm.id);
            });
            method = this.preDispatchService.addProductsBySelected(preDispatchId, productsIds);
        } else {
            method = this.preDispatchService.addProductsByFilters(preDispatchId);
        }
        this.actionsService.run(method, this.translate.instant('home.services.pre_dispatch_actions_service.prod_add'), () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            return this.translate.instant('home.services.pre_dispatch_actions_service.prod_add_suc');
        }, (error) => {
            if (typeof failed === 'function') {
                failed(error);
            }
            if (error && error.statusCode && error.statusCode === 507) {
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
            }
        });
    }

    createNewPreDispatch(data, name, failed: any = false, confirm = false, appendData = [], pre_dispatch_id = null) {
        const products: any = this.productsService.selectedProducts;
        let method;
        if (!data.method || data.method === 'selected') {
            if (!products || (typeof products === 'object' && !products.length)) {
                return this.snotifyService.error(this.translate.instant('home.services.pre_dispatch_actions_service.error'),
                 {showProgressBar: false, timeout: 3000});
            }
            const productsIds = [];
            products.forEach((elm) => {
                productsIds.push(elm.id);
            });
            appendData.forEach((elm) => {
                productsIds.push(elm.id);
            });
            method = this.preDispatchService.createBySelected(name, productsIds, confirm, pre_dispatch_id);
        } else {
            method = this.preDispatchService.createByFilters(name, confirm);
        }
        this.actionsService.run(method, this.translate.instant('home.services.pre_dispatch_actions_service.pre_cre'), () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            if (typeof data.finish === 'function') {
                data.finish();
            }
            return this.translate.instant('home.services.pre_dispatch_actions_service.pre_cre_suc');
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
                setTimeout(() => {
                    this.reloadData.emit(true);
                }, 500);
            }
        });

    }

    mergePreDispatches(name) {

        const preDispatches = this.preDispatchService.selectedPreDispatches;
        if (!preDispatches || (typeof preDispatches === 'object' && !preDispatches.length)) {
            return this.snotifyService.error(this.translate.instant('home.services.pre_dispatch_actions_service.error'),
             {showProgressBar: false, timeout: 3000});
        }
        const items = [];
        preDispatches.forEach((elm) => {
            items.push(elm.id);
        });

        const method = this.preDispatchService.merge(items, name);
        this.actionsService.run(method, this.translate.instant('home.services.pre_dispatch_actions_service.pre_merge'), () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            return this.translate.instant('home.services.pre_dispatch_actions_service.pre_merge_suc');
        }, (error) => error.error.message);
    }

    editPreDispatch(name, id) {
        const method = this.preDispatchService.edit(id, name);
        this.actionsService.run(method, this.translate.instant('home.services.pre_dispatch_actions_service.pre_edit'), () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            return this.translate.instant('home.services.pre_dispatch_actions_service.pre_edit_suc');
        }, (error) => error.error.message);
    }

    deletePreDispatch(ids, confirm = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const method = this.preDispatchService.delete(ids, confirm) ;
            this.actionsService.run(method, this.translate.instant('home.services.pre_dispatch_actions_service.pre_delet'), (result) => {
                setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
                resolve(result);
                return this.translate.instant('home.services.pre_dispatch_actions_service.pre_delet_suc') ;
            }, (error) => {
                reject(error);
                setTimeout(() => {this.reloadData.emit(true) ; }, 500 );
                return error.error ? error.error.message : (error.message ? error.message : 'Error') ;
            });
        });
    }

}
