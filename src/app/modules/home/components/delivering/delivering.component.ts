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

  // Dummy Data  {
  products = [
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In consegna'},
  ];
  // } Dummy Data

  constructor() { }
  ngOnInit() {
  }

}
