import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TablesConfig} from '../../../../config/tables.config';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {PaginationService} from '../../../../service/pagination.service';
import {ProductsService} from '../../../../service/products.service';
import {FiltersService} from '../../../../service/filters.service';
import {ActionsService} from '../../../../service/actions.service';

@Component({
  selector: 'app-pre-dispatch-products',
  templateUrl: './pre-dispatch-products.component.html',
  styleUrls: ['./pre-dispatch-products.component.css']
})
export class PreDispatchProductsComponent implements OnInit {

  constructor(
      protected route: ActivatedRoute,
      protected paginationService: PaginationService,
      protected productsService: ProductsService,
      protected filtersService: FiltersService,
      protected actionsService: ActionsService
  ) { }

  id: number ;
  table = TablesConfig.table.productsTable ;
  subscription: any ;
  products: any;
  @ViewChild('ProductsTable') _productsTable: TableComponent ;
  ngOnInit() {
      this.route.params.subscribe(params => {
          this.id = params['id'];
          this.filtersService.clear();
          this.loadProducts(true) ;
      });
      this.paginationService.rppValueChanges.subscribe((rpp: number) => {
          this.loadProducts(false) ;
      });
      this.paginationService.currentPageChanges.subscribe( (page: number) => {
          this.loadProducts(false) ;
      });
      this.filtersService.filtersChanges.subscribe((filters) => {
          this.loadProducts(true) ;
      });
      this.actionsService.setActions([]);
  }


  loadProducts(reset: boolean) {
      if ( this.subscription ) { this.subscription.unsubscribe(); }
      this.products = [];
      this._productsTable.loading(true);
      if (reset) {
          this.paginationService.updateCurrentPage(1, true);
          this.paginationService.updateLoadingState(true);
          this._productsTable.resetSelected();
      }
      this.subscription = this.productsService.getPreDispatchProducts(this.id)
          .subscribe((res: ApiResponseInterface) => {
              this.paginationService.updateLoadingState(false);
              this.paginationService.updateResultsCount(res.pagination.total);
              this.products = res.data ;
              this._productsTable.loading(false);
      });
  }
}
