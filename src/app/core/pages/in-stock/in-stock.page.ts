import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-in-stock',
  templateUrl: './in-stock.page.html',
  styleUrls: ['./in-stock.page.css']
})
export class InStockPage implements OnInit {

  constructor() { }

  active_tab = 'in-stock';

  // Dummy Data {
  citiesTable = {
      title:'Paese',
      icon:'assets/images/cityscape.svg',
      searchPlaceHolder: 'Cerca Paese'
  } ;
  cities = [
      {name:'ALL',qt:'Q.ta: 25302'},
      {name:'Imola',qt:'Q.a: 6852'},
      {name:'Bologna',qt:'Q.a: 8535'},
      {name:'Napoli',qt:'Q.a: 3545'},
      {name:'Giuliano in Campagna',qt:'Q.a: 5105'},
      {name:'Roma',qt:'Q.a: 5105'},
      {name:'Qualano',qt:'Q.a: 8535'},
      {name:'Rimini',qt:'Q.a: 8535'},
      {name:'Modna',qt:'Q.a: 8535'},
  ] ;
  streetsTable = {
      title:'Strada',
      icon: 'assets/images/work-tools.svg',
      searchPlaceHolder: 'Cerca Strada'
  } ;
  streets = [
      {name:'ALL',qt:'Q.ta: 25302'},
      {name:'Via Rivabella',qt:'Q.a: 124'},
      {name:'Via Enrico uno Berlinguer',qt:'Q.a: 16'},
      {name:'Corso italia',qt:'Q.a: 10'},
      {name:'Via Del lavoro',qt:'Q.a: 2'},
      {name:'Via Del lavoro',qt:'Q.a: 253'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
  ];
  productsTable = {
      cols:[
          {title:' ',field:false,actions:[
              {action:'view'},
              {action:'book'},
          ]},
          {title:'BARCODE',field:'barcode'},
          {title:'ATTO',field:'act'},
          {title:['PRODOTTO','DISTINTA'],field:['product_type','dispatch_list_n'],separator:true,value_separator:'dashed'},
          {title:'STATO',field:'state'},
          {title:['DATA/ORA','Q.TA','TENTATIVI'],field:['date','qty','attempts'],separator:false,value_separator:'dashed',classes:{
                  'qty':'text-center d-block',
                  'attempts':'text-center d-block'
              }},
          {title:['CLIENTE','MITTENTE','DESTINARIO'],field:['customer','sender','recipent'],separator:false,value_separator:'line',classes:{
                  'sender':'text-gray',
                  'recipent':'marked'
              }}
      ]
  };
  products = [
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
      {barcode:'IT0001490550',act:'ART82020182511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'In giacenza'},
  ];
  // } Dummy Data

  ngOnInit() {
  }

}
