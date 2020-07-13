import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {ProductsService} from '../../../../service/products.service';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';

@Component({
  selector: 'app-pre-dispatch-new',
  templateUrl: './pre-dispatch-new.component.html',
  styleUrls: ['./pre-dispatch-new.component.css']
})
export class PreDispatchNewComponent extends ModalComponent  implements OnInit, OnDestroy {

  constructor(
      private actionsService: ActionsService,
      public productsService: ProductsService,
      public filtersService: FiltersService,
      public paginationService: PaginationService,
      private modalService: NgbModal,
      private preDispatchService: PreDispatchService,
  ) {
      super();
  }

  name = '' ; // the new pre-dispatch name
  error: any = false ; // error to display.
  filtersCount = 0 ; // the total number of applied filters.
  selectedCount = 0; // the total number of selected products.
  filteredProductsCount = 0 ; // the total number of products when a filter is applied.
  confirmed = false ; // the confirmation status, used to check if user had agreed to the warning message.
  unsubscribe: Subject<void> = new Subject(); // used to kill subscriptions.
  products_with_errors = [];
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

  run(modal, already_in_other_modal_ref) {
    // if name was not entered stop with error 1 (the pre-dispatch name is required).
    if ( !this.name || this.name === '' ) { return this.error = 1; }
    // if new was less than 3 chars stop with error 2 (the pre-dispatch name must be at least 3 chars).
    if ( this.name.length < 3 ) { return this.error = 2; }

    // if every thing is ok, create the pre-dispatch
    this.actionsService.createNewPreDispatch(this.data, this.name, (error) => {
      if (error && error.statusCode && error.statusCode === 507) {
          // show the repeated data modal
          this.products_with_errors = error.data ;
          this.modalService.open(already_in_other_modal_ref);
      }
    }) ;
    modal.close(); // close the modal.
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
