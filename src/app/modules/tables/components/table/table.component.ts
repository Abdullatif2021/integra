import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor() { }

  @Input() table : object = {
    cols:[
        {title:' ',field:false,actions:['view','book'],width:5},
        {title:'BARCODE',field:'barcode',width:10},
        {title:'ATTO',field:'act',widht:15},
        {title:['PRODOTTO','DISTINTA'],field:['product_type','dispatch_list_n'],separator:true,value_separator:'dashed',width:22},
        {title:'STATO',field:'state',width:8},
        {title:['DATA/ORA','Q.TA','TENTATIVI'],field:['date','qty','attempts'],separator:false,value_separator:'dashed',classes:{
                'qty':'text-center d-block',
                'attempts':'text-center d-block'
            },width:10},
        {title:['CLIENTE','MITTENTE','DESTINARIO'],field:['customer','sender','recipent'],separator:false,value_separator:'line',classes:{
                'sender':'text-gray',
                'recipent':'marked'
            },width:30}
    ]
  };

  @Input() items = [
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
      {barcode:'IT0001490550',act:'ART82020180002511',product_type:'RACCOMANDATA CON RICEVUTA DI RITTORNO',dispatch_list_n:'DE-5C8659F896120-11023019135208',date:'10/02/2019 19:30',qty:1,attempts:0,customer:'NOME CLIENTE',sender:'NOMINATIVO - STRADA, NCIVICO - 81100 Caserta (CE) [Note: Anagrafica]',recipent:'POLITO LUIGI - VIA PLAUTO , N.8/1 L - 80022 ARZANO (NA)',state:'consegnare'},
  ] ;

  ngOnInit() {
  }


  typeof(variable){
    return typeof variable ;
  }

  getFieldClass(col,field){
    if(typeof col.classes !== 'undefined'){
        return col.classes[field]?col.classes[field]:'';
    }

    return '' ;
  }

}
