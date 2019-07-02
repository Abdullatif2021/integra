import {Component, OnInit, ViewChild} from '@angular/core';
import { CitiesService } from '../../../../service/cities.service';
import { TablesConfig } from '../../../../config/tables.config';
import {StreetsService} from '../../../../service/streets.service';
import {ProductsService} from '../../../../service/products.service';
import {PaginationService} from '../../../../service/pagination.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {FiltersService} from '../../../../service/filters.service';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchAddComponent} from '../../modals/pre-dispatch-add/pre-dispatch-add.component';
import {PreDispatchNewComponent} from '../../modals/pre-dispatch-new/pre-dispatch-new.component';

@Component({
  selector: 'app-to-deliver',
  templateUrl: './to-deliver.component.html',
  styleUrls: ['./to-deliver.component.css']
})
export class ToDeliverComponent implements OnInit {

  constructor(
      private citiesService: CitiesService,
      private streetsService: StreetsService,
      private productsService: ProductsService,
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private actionsService: ActionsService,
  ) {
      this.paginationService.updateResultsCount(null) ;
      this.paginationService.updateLoadingState(true) ;
  }

  productsTable = TablesConfig.table.productsTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;
  products: any ;
  @ViewChild('CitiesTable') _citiesTable ;
  @ViewChild('StreetsTable') _streetsTable ;
  @ViewChild('ProductsTable') _productsTable: TableComponent ;
  subscription: any = false ;
  current_city: number = null ;
  current_street: number = null ;

  actions = [
      {name: 'Crea nuova Pre-Distinta', fields: [
              { type: 'select', field: 'method', options: [
                      {name: 'Selezionati', value: 'selected'},
                      {name: 'Secondo i filtri applicati', value: 'filters'}
                  ], selectedAttribute: {name: 'Selezionati', value: 'selected'}}
          ],
          modal: PreDispatchNewComponent
      },
      {name: 'Aggiungi a Pre-Distinta esistente', fields: [
              { type: 'select', field: 'method', options: [
                  {name: 'Selezionati', value: 'selected'},
                  {name: 'Secondo i filtri applicati', value: 'filters'}
              ], selectedAttribute: {name: 'Selezionati', value: 'selected'}}
          ],
          modal: PreDispatchAddComponent,
      },
  ];

  citiesGetMethod = (page, rpp, name) => this.citiesService.getCities(page, rpp, name);
  streetsGetMethod = (page, rpp, name) => this.streetsService.getStreets(page, rpp, name, this.current_city)

  cityChanged(event) {
    this.current_city = event === null ? null : event.id ;
    this._streetsTable.loadData(false).selectItem(null);
  }

  streetChanged(event) {
      this.current_street = event === null ? null : event.id ;
      this.loadProducts(true);
  }

  ngOnInit() {
      this.filtersService.clear();
      this.loadProducts(false);
      this.paginationService.rppValueChanges.subscribe((rpp: number) => {
          this.loadProducts(false) ;
      });
      this.paginationService.currentPageChanges.subscribe( (page: number) => {
          this.loadProducts(false) ;
      });
      this.filtersService.filtersChanges.subscribe((filters) => {
          this.loadProducts(true) ;
          this._streetsTable.reload();
          this._citiesTable.reload();
      });
      this.actionsService.setActions(this.actions);
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
      this.subscription = this.productsService.getToDeliverProducts(
          this.current_city,
          this.current_street,
      ).subscribe((res: ApiResponseInterface) => {
          this.paginationService.updateLoadingState(false);
          this.paginationService.updateResultsCount(res.pagination.total);
          this.products = res.data ;
          this._productsTable.loading(false);
      });
  }

  selectedItemsChanged(items) {
      this.productsService.selectedProducts = items ;
  }

}
