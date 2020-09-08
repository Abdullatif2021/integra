import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { TablesConfig } from '../../../../config/tables.config';
import {PaginationService} from '../../../../service/pagination.service';
import {FilterConfig} from '../../../../config/filters.config';
import {IntegraaModalService} from '../../../../service/integraa-modal.service';
import {CustomersService} from '../../../../service/customers.service';
import {AgenciesService} from '../../../../service/agencies.service';
import {DispatchService} from '../../../../service/dispatch.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {DispatchActionsService} from '../../service/dispatch-actions.service';
import {RecipientsService} from '../../../../service/recipients.service';
import {ActionsService} from '../../../../service/actions.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {FiltersService} from '../../../../service/filters.service';
import {CategoriesService} from '../../../../service/categories.service';

@Component({
  selector: 'app-delivering',
  templateUrl: './delivering.component.html',
  styleUrls: ['./delivering.component.css']
})
export class DeliveringComponent implements OnInit, OnDestroy, AfterViewInit {
    dispatchTableConfig = TablesConfig.table.deliveringTable;
    postmenTableConfig = TablesConfig.simpleTable.postmenTable;
    unsubscribe: Subject<void> = new Subject();
    subscription: any = false;
    dispatchList = [];
    order_field = null;
    order_method = '1';
    selected_postmen = null;
    viewType: any = 'table';

    // the dispatches table component, presented in table view.
    @ViewChild('dispatchTable') _dispatchTable;
    @ViewChild('postmenTable') _postmenTable;

    filtersConfig = null;
    actions = [
    ];


    postmenGetMethod = (page, rpp, name, order) => this.dispatchService.getAssignedPostmen(page, rpp, name, order, 'PREPARED');

    constructor(
        private paginationService: PaginationService,
        private filtersService: FiltersService,
        private actionsService: ActionsService,
        private dispatchService: DispatchService,
        private dispatchActionsService: DispatchActionsService,
        private integraaModalService: IntegraaModalService,
        protected customersService: CustomersService,
        protected agenciesService: AgenciesService,
        protected recipientsService: RecipientsService,
        private categoriesService: CategoriesService
    ) {
    }

    ngOnInit() {
        this.actionsService.setActions(this.actions);
        this.filtersService.clear();
        this.filtersService.setFields(FilterConfig.delivering, this);
        this.filtersConfig = <any>Object.assign({}, FilterConfig.delivering);
        this.dispatchActionsService.reloadData.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
            this.loadItems(false);
            this.dispatchService.selectedDispatches = [];
        });
        this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filters) => {
            this.loadItems(true) ;
            this._postmenTable.reload();
        });
        this.paginationService.rppValueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((rpp: number) => {
            this.loadItems(false) ;
        });
        this.paginationService.currentPageChanges.pipe(takeUntil(this.unsubscribe)).subscribe( (page: number) => {
            this.loadItems(false) ;
        });
    }

    ngAfterViewInit() {
        this.loadItems(true);
    }

    // when the user select a postman to filter. <table view>
    changePostman(event) {
        this.selected_postmen = event;
        this.loadItems(true);
    }

    // main load dispatches method. <table view>
    loadItems(reset) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.dispatchList = [];
        this._dispatchTable.loading(true);
        if (reset) {
            this.paginationService.updateCurrentPage(1, true);
            this.paginationService.updateLoadingState(true);
            this._dispatchTable.resetSelected();
        }
        this.subscription = this.dispatchService.getDispatches(
            false,
            this.selected_postmen,
            this.order_field,
            this.order_method,
            'PREPARED'
        )
            .pipe(takeUntil(this.unsubscribe)).subscribe((res: ApiResponseInterface) => {
                this.paginationService.updateLoadingState(false);
                this.paginationService.updateResultsCount(res.pagination ? res.pagination.total : 1);
                this.dispatchService.selectedDispatches = [];
                this.dispatchList = res.data;
                this._dispatchTable.loading(false);
            });
    }

    orderChanged(order) {}

    selectedItemsChanged(items) {
        this.dispatchService.selectedDispatches = items;
    }

    showLogModal(elm) {
        this.integraaModalService.open(`/pages/dispatch/${elm.id}/log`,
            {width: 1000, height: 600, title: `Log: ${elm.pre_dispatch_code}`}, {});
    }
    showDispatchModal(elm) {
        this.integraaModalService.open(`/pages/dispatch/view/${elm.id}`,
            {width: 1420, height: 710, title: `Show: ${elm.pre_dispatch_code}`}, {});
    }

    getCategoriesByName(name) {
        return this.categoriesService.getCategoriesByName(name);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
