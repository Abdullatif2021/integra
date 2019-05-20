import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-dispatch',
  templateUrl: './pre-dispatch.page.html',
  styleUrls: ['./pre-dispatch.page.css']
})
export class PreDispatchPage implements OnInit {

  active_tab = 'pre-dispatch' ;

  productsTable = {
      cols:[
          {title:' ',field:false,actions:[
              {action:'edit',click:(elm)=>{console.log('export . ')}},
              {action:'print',click:(elm)=>{console.log('print . ')}},
              {action:'excel_export',click:(elm)=>{console.log('export . ')}},
              {action:'view',click:(elm)=>{console.log('call back working 1 . ')}},
          ]},
          {title:'PRE-DISPATCH LIST NAME',field:'list_name',actions:[]},
          {title:'PRE-DISPATCH LIST N°',field:'list_id',actions:[]},
          {title:'STATE / RESULT',field:'status',actions:[
              {action:'view',click:(elm)=>{console.log('call back working 2 . ')},_class:['float-right','mt-0','mr-2']}
          ]},
          {title:'Q.TY',field:'qty',actions:[]},
          {title:'DATE',field:'date',actions:[]},
          {title:'OPERATION',actions:[
                  {action:'progress',field:'progress'},
                  {action:'pp',field:'p_status',print_if:(elm)=>{return elm.progress !== 100},click:(elm)=>{console.log('status should change now')}}
          ]},
      ]
  };

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


  constructor() { }

  ngOnInit() {
  }

}
