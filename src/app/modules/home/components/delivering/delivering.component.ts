import { Component, OnInit } from '@angular/core';
import { TablesConfig } from '../../../../config/tables.config';

@Component({
  selector: 'app-delivering',
  templateUrl: './delivering.component.html',
  styleUrls: ['./delivering.component.css']
})
export class DeliveringComponent implements OnInit {

  productsTable = TablesConfig.table.productsTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;

  constructor() { }
  ngOnInit() {
  }

}
