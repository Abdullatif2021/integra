import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ProductsService} from '../../../../service/products.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {PreDispatchActionsService} from '../../service/pre-dispatch-actions.service';

@Component({
  selector: 'app-pwsisbs-confirm-modal',
  templateUrl: './pwsisbs-confirm-modal.component.html',
  styleUrls: ['./pwsisbs-confirm-modal.component.css']
})
export class PwsisbsConfirmModalComponent extends ModalComponent implements OnInit, OnDestroy {

  constructor(
      private preDispatchActionsService: PreDispatchActionsService,
      protected productsService: ProductsService
  ) {
      super();
  }

  unsubscribe: Subject<void> = new Subject();
  data: any;
  items = [];
  page = 1;
  loading = false;

  ngOnInit() {
      this.items = this.data.data.products;
  }

  runContinue(modal) {
      modal.close();
      this.preDispatchActionsService.createNewPreDispatch(this.data.defaultData, this.data.name, (error) => {
      }, true) ;
  }

  paginate(step) {
      this.page += step;
      this.loading = true ;
      this.items = [];
      this.productsService.getProductByCategory(this.data.data.products_ids, true, this.page)
          .pipe(takeUntil(this.unsubscribe)).subscribe(
              data => {
                  this.items = data.data;
                  this.loading = false;
              },
              error => {
                  this.loading = false ;
              }
      );
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
