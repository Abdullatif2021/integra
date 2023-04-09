import { Component, OnInit } from '@angular/core';
import { TablesConfig } from '../../../../config/tables.config';

@Component({
  selector: 'app-not-deliverd',
  templateUrl: './not-delivered.component.html',
  styleUrls: ['./not-delivered.component.css']
})
export class NotDeliveredComponent implements OnInit {

  constructor() { }

  productsTable = TablesConfig.table.productsTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;

  ngOnInit() {
  }

}
