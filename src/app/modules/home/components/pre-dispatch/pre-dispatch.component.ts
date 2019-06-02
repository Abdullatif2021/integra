import { Component, OnInit } from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';

@Component({
  selector: 'app-pre-dispatch',
  templateUrl: './pre-dispatch.component.html',
  styleUrls: ['./pre-dispatch.component.css']
})
export class PreDispatchComponent implements OnInit {

  preDispatchTable = TablesConfig.table.preDispatchTable ;

  // Dummy data {
  products = [
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Da Pianificare',qty:124,date:'13/03/2019',progress:0,p_status:1},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Da Pianificare',qty:124,date:'13/03/2019',progress:0,p_status:1},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Pianificato',qty:124,date:'13/03/2019',progress:100,p_status:1},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Da Pianificare',qty:124,date:'13/03/2019',progress:63,p_status:1},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Da Pianificare',qty:124,date:'13/03/2019',progress:30,p_status:0},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Pianificato',qty:124,date:'13/03/2019',progress:100,p_status:1},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Da Pianificare',qty:124,date:'13/03/2019',progress:63,p_status:1},
      {list_name:'Nome Distinta scelto dall’operatore',list_id:'de-5c8659f896120-11032019135208',status:'Da Pianificare',qty:124,date:'13/03/2019',progress:0,p_status:1},
  ]
  // } Dummy data


  constructor() { }

  ngOnInit() {
  }

}
