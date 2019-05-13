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
        {title:' ',field:false,actions:['view','book']},
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
        console.log(col,field)
        return col.classes[field]?col.classes[field]:'';
    }

    return '' ;
  }

}
