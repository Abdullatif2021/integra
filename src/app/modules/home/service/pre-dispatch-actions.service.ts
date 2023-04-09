import {EventEmitter, Injectable} from '@angular/core';
import {ProductsService} from '../../../service/products.service';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {SnotifyService} from 'ng-snotify';
import {ActionsService} from '../../../service/actions.service';

@Injectable()
export class PreDispatchActionsService {

    constructor(
        private actionsService: ActionsService,
        private snotifyService: SnotifyService,
        private productsService: ProductsService,
        private preDispatchService: PreDispatchService
    ) {
    }

    reloadData = new EventEmitter();

    addToPreDispatch(data, preDispatchId, failed: any = null) {

        const products: any = this.productsService.selectedProducts;
        let method;
        if (!data.method || data.method === 'selected') {
            if (!products || (typeof products === 'object' && !products.length)) {
                return this.snotifyService.error('Nessun prodotto selezionato', {showProgressBar: false, timeout: 3000});
            }
            const productsIds = [];
            products.forEach((elm) => {
                productsIds.push(elm.id);
            });
            method = this.preDispatchService.addProductsBySelected(preDispatchId, productsIds);
        } else {
            method = this.preDispatchService.addProductsByFilters(preDispatchId);
        }
        this.actionsService.run(method, 'Aggiunta in corso', () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            return 'Prodotti aggiunti con successo';
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
                return this.snotifyService.error('Nessun prodotto selezionato', {showProgressBar: false, timeout: 3000});
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
        this.actionsService.run(method, 'Creazione Pre-Distinta in corsot', () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            if (typeof data.finish === 'function') {
                data.finish();
            }
            return 'Pre-distinta Creata con successo';
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
            return this.snotifyService.error('Nessuna predestinata selezionata', {showProgressBar: false, timeout: 3000});
        }
        const items = [];
        preDispatches.forEach((elm) => {
            items.push(elm.id);
        });

        const method = this.preDispatchService.merge(items, name);
        this.actionsService.run(method, 'Unione in corso', () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            return 'Pre-Distinte uniti con successo';
        }, (error) => error.error.message);
    }

    editPreDispatch(name, id) {
        const method = this.preDispatchService.edit(id, name);
        this.actionsService.run(method, 'Edit in corso', () => {
            setTimeout(() => {
                this.reloadData.emit(true);
            }, 500);
            return 'Pre-Distinte Edit con successo';
        }, (error) => error.error.message);
    }

    deletePreDispatch(ids, confirm = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const method = this.preDispatchService.delete(ids, confirm) ;
            this.actionsService.run(method, 'Elimina in corso', (result) => {
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
