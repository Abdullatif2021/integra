import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {ActionsService} from '../../../../service/actions.service';
import {ProductsService} from '../../../../service/products.service';
import {takeUntil} from 'rxjs/internal/operators';
import {PaginationService} from '../../../../service/pagination.service';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pre-dispatch-add',
  templateUrl: './pre-dispatch-add.component.html',
  styleUrls: ['./pre-dispatch-add.component.css']
})

export class PreDispatchAddComponent extends ModalComponent implements OnInit, OnDestroy {

  options = [
      {name: 'Il nome della Pre-distinta', value: 'name'},
      {name: 'N° della Predistinta', value: 'code'}
  ];

  bindLabel = 'name' ;
  preDispatches: any = [] ;
  selected = null ;
  error: any = false ;
  filteredProductsCount = 0;
  unsubscribe: Subject<void> = new Subject();
  products_with_errors = [];
  searching = false;
  constructor(
      private preDispatchService: PreDispatchService,
      private actionsService: ActionsService,
      public productsService: ProductsService,
      public paginationService: PaginationService,
      private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.filteredProductsCount = this.paginationService.resultsCount ;
    this.paginationService.resultsCountChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
          this.filteredProductsCount = data;
      });
    this.preDispatchService.getPreDispatchList().subscribe((res: ApiResponseInterface) => {
      if (res.status === 'success') {
        this.preDispatches = this.formatData(res.data);
      }
    });
  }

  formatData(data) {
    const formatted = [];
    data.forEach(elm => {
        elm['name_code'] = `${elm.name} [${elm.code}]`;
        formatted.push(elm);
    })
    return formatted;
  }

  changeBindLabel(event) {
    this.bindLabel = event.value ;
  }

  select(item) {
    this.error = false ;
    this.selected = item ? item.id : null;
  }

  run(modal, already_in_other_modal_ref) {
    if (!this.selected) { return this.error = 1 ; }
    this.actionsService.addToPreDispatch(this.data, this.selected, (error) => {
        if (error && error.statusCode && error.statusCode === 507) {
            // show the repeated data modal
            this.products_with_errors = error.data ;
            this.modalService.open(already_in_other_modal_ref);
        }
    }) ;
    modal.close();
  }

  search(event) {
    const term = event.term ;
    this.searching = true;
    this.preDispatchService.getPreDispatchList(1, '100', term).subscribe((res: ApiResponseInterface) => {
      if (res.status === 'success') {
        this.preDispatches = this.formatData(res.data);
      }
      this.searching = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
