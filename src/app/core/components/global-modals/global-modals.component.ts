import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {ProductsService} from '../../../service/products.service';
import {ModalDirective} from '../../../shared/directives/modal.directive';

@Component({
    selector: 'app-global-modals',
    templateUrl: './global-modals.component.html',
    styleUrls: ['./global-modals.component.css']
})


// place all popups you want to fire anywhere in the website here.
export class GlobalModalsComponent implements OnInit, OnDestroy {

    constructor(
        private preDispatchService: PreDispatchService,
        private modalService: NgbModal,
        private productsService: ProductsService
    ) {
    }

    @ViewChild('confirmPlanningModalRef') planningConfirmModal;
    @ViewChild('confirmPlanningAddProductsModalRef') planningAddProductsConfirmModal;
    unsubscribe: Subject<void> = new Subject();
    planning_add_products_items = [];
    planning_add_products_page = 1;
    planning_add_products_loading = false ;
    planning_add_products_data: any;

    ngOnInit() {
        this.preDispatchService.showConfirmPlanningModalCalls.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.modalService.open(this.planningConfirmModal, {backdrop: 'static', keyboard: false});
            }
        );
        this.preDispatchService.showConfirmPlanningAddProductsModalCalls.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.planning_add_products_data = data ;
                this.planning_add_products_items = data.data;
                this.modalService.open(this.planningAddProductsConfirmModal, {backdrop: 'static', keyboard: false});
            }
        );
    }

    paginatePlanningAddProducts(step) {
        this.planning_add_products_page += step;
        this.planning_add_products_loading = true;
        this.planning_add_products_items = [];
        this.productsService.getProductByCategory(this.planning_add_products_data.products_ids, true, this.planning_add_products_page)
            .pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.planning_add_products_items = data.data;
                this.planning_add_products_loading = false;
            },
            error => {
                this.planning_add_products_loading = false;
            }
        );
    }

    confirmPlanningActionChosen(action) {
        // window.parent.postMessage({confirmPlanningClicked: action}, '*');
        this.preDispatchService.confirmPlanningModalGotUserResponse.emit(action);

    }

    confirmPlanningAddProductsChosen(action) {
        this.preDispatchService.confirmPlanningAddProductsModalGotUserResponse.emit(action);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
