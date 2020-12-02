import { Component, OnInit } from '@angular/core';
import { TablesConfig } from '../../../../config/tables.config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-in-stock',
  templateUrl: './in-stock.component.html',
  styleUrls: ['./in-stock.component.css']
})
export class InStockComponent implements OnInit {

  constructor(

        private translate: TranslateService,

    ) {
      }

  productsTable = TablesConfig.table.productsTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;

  ngOnInit() {
  }

}
