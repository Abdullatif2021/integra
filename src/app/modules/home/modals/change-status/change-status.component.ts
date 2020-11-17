import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {FiltersService} from '../../../../service/filters.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductsService} from '../../../../service/products.service';
import {PaginationService} from '../../../../service/pagination.service';
import {SnotifyService} from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';
import {ProductStatusService} from '../../../../service/product-status.service';
import {NotDeliveredService} from '../../../../service/not-delivered.service';

@Component({
  selector: 'app-set-status-modal',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.css']
})
export class ChangeStatusComponent extends ModalComponent implements OnInit, OnDestroy {
    error = 0;
    filtersCount = 0 ; // the total number of applied filters.
    selectedCount = 0; // the total number of selected products.
    filteredProductsCount = 0 ; // the total number of products when a filter is applied.
    confirmed = false ; // the confirmation status, used to check if user had agreed to the warning message.
    unsubscribe: Subject<void> = new Subject(); // used to kill subscriptions.
    stats = [];
    selectedStatus = null ;
  constructor(
      private productsService: ProductsService,
      public filtersService: FiltersService,
      public paginationService: PaginationService,
      private modalService: NgbModal,
      private productstatusService: ProductStatusService,
      private snotifyService: SnotifyService,
      private translate: TranslateService,
      private notdeliveredService: NotDeliveredService
  ) { super();
    translate.setDefaultLang('itly');
    const browserLang = translate.getBrowserLang();
    }

  ngOnInit() {

      this.loadStats();
      this.filtersCount = Object.keys(this.filtersService.filters).length;

      // get selected products count.
      this.selectedCount = this.notdeliveredService.selectedProducts.length ;

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
      this.productstatusService.getStats('not_delivered').subscribe(data => {
          this.stats = data.data ;
      }, error => {
          console.error('something went wrong');
      });
  }

  run(modal) {
      if (!this.selectedStatus) {
          return this.error = 1;
      }
      if (this.data.method === 'selected') {
        console.log()
        this.productsService.updateProductsStatusByProducts(this.notdeliveredService.selectedProducts, this.selectedStatus).subscribe(
            data => {
                if (data.success) {
                    this.snotifyService.success('Status changed successfully', { showProgressBar: false, timeout: 2000 });
                } else {
                    this.snotifyService.error('Something went wrong', { showProgressBar: false, timeout: 2000 });
                }
            }, error => {
                this.snotifyService.error('Something went wrong', { showProgressBar: false, timeout: 2000 });
            }
        );
      }
      if (this.data.method === 'filters') {
        this.productsService.updateProductsStatusByFilters(this.selectedStatus).subscribe(
            data => {
                if (data.success) {
                    this.snotifyService.success('Status changed successfully', { showProgressBar: false, timeout: 2000 });
                } else {
                    this.snotifyService.error('Something went wrong', { showProgressBar: false, timeout: 2000 });
                }
            }, error => {
                this.snotifyService.error('Something went wrong', { showProgressBar: false, timeout: 2000 });
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
