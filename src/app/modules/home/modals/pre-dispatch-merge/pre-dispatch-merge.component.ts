import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ProductsService} from '../../../../service/products.service';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {PreDispatchActionsService} from '../../service/pre-dispatch-actions.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';

@Component({
  selector: 'app-pre-dispatch-merge',
  templateUrl: './pre-dispatch-merge.component.html',
  styleUrls: ['./pre-dispatch-merge.component.css']
})
export class PreDispatchMergeComponent extends ModalComponent implements OnInit {

  constructor(
    private preDispatchActionsService: PreDispatchActionsService,
    public productsService: ProductsService,
    public filtersService: FiltersService,
    public paginationService: PaginationService,
    private modalService: NgbModal,
    private preDispatchService: PreDispatchService,
    private translate: TranslateService,
    private translateSelectorService: TranslateSelectorService,

      ) {
        super();
        this.translateSelectorService.setDefaultLanuage();
      }

    name = '' ; // the new pre-dispatch name
    error: any = false ; // error to display.
    filtersCount = 0 ; // the total number of applied filters.
    selectedCount = 0; // the total number of selected products.
    filteredProductsCount = 0 ; // the total number of products when a filter is applied.
    confirmed = false ; // the confirmation status, used to check if user had agreed to the warning message.
    unsubscribe: Subject<void> = new Subject(); // used to kill subscriptions.
  ngOnInit() {
     // get the number of applied filters.
     this.filtersCount = Object.keys(this.filtersService.filters).length;

     // get selected products count.
     this.selectedCount = this.productsService.selectedProducts.length ;
 
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

  changeName(event) {
      this.name = event.target.value ;
  }
  confirm() {
      this.confirmed = true ;
  }
  run(modal) {
    if ( !this.name || this.name === '') { return this.error = 1 ; }
    if ( this.name.length < 3 ) { return this.error = 2 ; }

    this.preDispatchActionsService.mergePreDispatches(this.name) ;
    modal.close();
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
