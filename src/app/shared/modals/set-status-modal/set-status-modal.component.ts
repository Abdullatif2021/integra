import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductsService} from '../../../service/products.service';
import {PaginationService} from '../../../service/pagination.service';
import {SnotifyService} from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';
import {FiltersService} from '../../../service/filters.service';
import {StatusesService} from '../../service/statuses.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-set-status-modal',
    templateUrl: './set-status-modal.component.html',
    styleUrls: ['./set-status-modal.component.css']
})
export class SetStatusModalComponent extends ModalComponent implements OnInit, OnDestroy {
    error = 0;
    filtersCount = 0 ; // the total number of applied filters.
    selectedCount = 0; // the total number of selected products.
    filteredProductsCount = 0 ; // the total number of products when a filter is applied.
    confirmed = false ; // the confirmation status, used to check if user had agreed to the warning message.
    unsubscribe: Subject<void> = new Subject(); // used to kill subscriptions.
    stats = [];
    selectedStatus = null ;
    selectedItems = [] ;
    constructor(
        private productsService: ProductsService,
        public filtersService: FiltersService,
        public paginationService: PaginationService,
        private modalService: NgbModal,
        private snotifyService: SnotifyService,
        private translate: TranslateService,
        private router: Router,
        private statusesService: StatusesService
    ) { super(); }

    ngOnInit() {
        this.selectedItems = this.data.modalData.selected;
        if (typeof this.data.modalData.selected === 'function') {
            this.selectedItems = this.data.modalData.selected();
        }
        this.loadStats();
        this.filtersCount = Object.keys(this.filtersService.filters).length;

        // get selected products count.
        this.selectedCount = this.selectedItems.length;

        // if a street or a city is selected change the filters count.
        // Note that cities and streets filters are treated in a special way in filters service, we'r doing this step because of that.
        if (this.filtersService.specials.cities && !this.filtersService.specials.cities.all) { this.filtersCount++; }
        if (this.filtersService.specials.streets && !this.filtersService.specials.streets.all) { this.filtersCount++; }

        // get total filtered products counts and subscribe to the count changes.
        this.filteredProductsCount = this.paginationService.resultsCount ;
        this.paginationService.resultsCountChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.filteredProductsCount = data;
            }
        );
    }

    loadStats() {
        this.statusesService.getStats(this.data.modalData.state).subscribe(data => {
            this.stats = data.data ;
        }, error => {
            console.error('something went wrong');
        });
    }

    run(modal) {
        if (!this.selectedStatus) {
            return this.error = 1;
        }
        const run = {} ;
        if (this.data.method === 'selected') {
            let selected = this.data.modalData.selected;
            if (typeof this.data.modalData.selected === 'function') {
                selected = this.data.modalData.selected();
                this.filtersService.updateFilters(this.run) ;

            }
            this.statusesService.updateProductsStatusByProducts(selected, this.selectedStatus).subscribe(
                data => {
                    if (data.success) {
                        this.snotifyService.success(this.translate.instant('pages.dispatch_view.modals.set_status.success_massege'),
                         { showProgressBar: false, timeout: 2000 });
                    } else {
                        this.snotifyService.error(this.translate.instant('pages.dispatch_view.modals.set_status.wrong_massege'),
                         { showProgressBar: false, timeout: 2000 });
                    }
                }, error => {
                    this.snotifyService.error(this.translate.instant('pages.dispatch_view.modals.set_status.wrong_massege'),
                    { showProgressBar: false, timeout: 2000 });
                }
            );
        }
        if (this.data.method === 'filters') {
            this.statusesService.updateProductsStatusByFilters(this.selectedStatus).subscribe(
                data => {
                    if (data.success) {
                        this.snotifyService.success(this.translate.instant('pages.dispatch_view.modals.set_status.success_massege'),
                         { showProgressBar: false, timeout: 2000 });
                    } else {
                        this.snotifyService.error(this.translate.instant('pages.dispatch_view.modals.set_status.wrong_massege')
                        , { showProgressBar: false, timeout: 2000 });
                    }
                }, error => {
                    this.snotifyService.error(this.translate.instant('pages.dispatch_view.modals.set_status.wrong_massege'),
                     { showProgressBar: false, timeout: 2000 });
                }
            );
        }
        modal.close();
    }

    confirm() {
        this.confirmed = true ;

    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
