import {Component, OnInit, ViewChild} from '@angular/core';
import { CitiesService } from '../../../../service/cities.service';
import { TablesConfig } from '../../../../config/tables.config';
import {StreetsService} from '../../../../service/streets.service';
import {ProductsService} from '../../../../service/products.service';
import {PaginationService} from '../../../../service/pagination.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {FiltersService} from '../../../../service/filters.service';
import {TableComponent} from '../../../../shared/components/table/table.component';

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
      private filtersService: FiltersService
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

  citiesGetMethod = (page, rpp, name) => this.citiesService.getCities(page, rpp, name);
  streetsGetMethod = (page, rpp, name) => this.streetsService.getStreets(page, rpp, name, this.current_city)

  cityChanged(event) {
    if (event === null) {
      this.current_city = null ;
    } else {
      this.current_city = event.id ;
    }
    this._streetsTable.loadData(false).reset();
    this.loadProducts(true);
  }

  streetChanged(event) {
      if (event === null) {
          this.current_street = null ;
      } else {
          this.current_street = event.id ;
      }
      this.loadProducts(true);
  }

  ngOnInit() {
      this.loadProducts(false);
      this.paginationService.rppValueChanges.subscribe((rpp: number) => {
          this.loadProducts(false) ;
      });
      this.paginationService.currentPageChanges.subscribe( (page: number) => {
          this.loadProducts(false) ;
      });
      this.filtersService.filtersChanges.subscribe((filters) => {
          this.loadProducts(true) ;
      });
  }

  loadProducts(reset: boolean) {
      if ( this.subscription ) { this.subscription.unsubscribe(); }
      this.products = [];
      this._productsTable.loading(true);
      if (reset) {
          // TODO fix tow times products loading caused by page change
          this.paginationService.updateCurrentPage(1);
          this.paginationService.updateLoadingState(true);
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

}
