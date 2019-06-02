import {Component, OnInit, ViewChild} from '@angular/core';
import { CitiesService } from '../../../../service/cities.service';
import { TablesConfig } from '../../../../config/tables.config';
import {StreetsService} from '../../../../service/streets.service';
import {ProductsService} from '../../../../service/products.service';
import {PaginationService} from '../../../../service/pagination.service';

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
      private paginationService: PaginationService
  ) { }

  productsTable = TablesConfig.table.productsTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;

  @ViewChild('CitiesTable') _citiesTable ;
  @ViewChild('StreetsTable') _streetsTable ;
  @ViewChild('ProductsTable') _productsTable ;

  current_city: number = null ;
  current_street: number = null ;

  citiesGetMethod = (page, rpp, name) => this.citiesService.getCities(page, rpp, name);
  streetsGetMethod = (page, rpp, name) => this.streetsService.getStreets(page, rpp, name, this.current_city)
  productsGetMethod = (page, rpp) => this.productsService.getToDeliverProducts(page, rpp, this.current_city, this.current_street);

  cityChanged(event) {
    if (event === null) {
      this.current_city = null ;
    } else {
      this.current_city = event.id ;
    }
    this._streetsTable.loadData(false);
    this._productsTable.loadData(false);
  }

  streetChanged(event) {
      if (event === null) {
          this.current_street = null ;
      } else {
          this.current_street = event.id ;
      }
      this._productsTable.loadData(false);
  }

  ngOnInit() {
      this.paginationService.updateResultsCount(null) ;
      this.paginationService.updateLoadingState(true) ;
  }

}
