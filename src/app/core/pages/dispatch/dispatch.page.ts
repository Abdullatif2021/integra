import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.page.html',
  styleUrls: ['./dispatch.page.css']
})
export class DispatchPage implements OnInit {

  active_tab = 'dispatch' ;

  // Dummy Data {
  productsTable = {
        cols:[
            {title:' ',field:false,actions:[
                    {action:'edit',click:(elm)=>{console.log('export . ')}},
                    {action:'print',click:(elm)=>{console.log('print . ')}},
                    {action:'excel_export',click:(elm)=>{console.log('export . ')}},
                    {action:'view',click:(elm)=>{console.log('call back working 1 . ')}},
                ]},
            {title:'POSTMAN HELPER',field:'postman',actions:[]},
            {title:'Dispatch list',field:'distinita',actions:[]},
            {title:'STATE / RESULT',field:'status',actions:[]},
            {title:'Q.TY',field:'qty',actions:[]},
            {title:'DATE',field:'date',actions:[]},
            {title:'OPERATION',actions:[
                    {action:'progress',field:'progress'},
                ]},
        ]
    };

  products = [
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:100},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
      {postman:'SALZANO CLAUDIO',distinita:'de-5c8659f896120-11032019135208',status:'In consegna',qty:124,date:'13/03/2019',progress:0},
  ];

  postmenTable = {
      title:'Expected Postmen',
      icon: 'assets/images/postman-icon.png',
      searchPlaceHolder: 'Cerca postino previsto'
  } ;
  postmen = [
      {name:'TUTTI'},
      {name:'Bellotti Nicola'},
      {name:'Botta Raffaele'},
      {name:'Turco Luca'},
      {name:'Liccardi Domenico'},
      {name:'Rocco'},
      {name:'Salzano Claudio'},
      {name:'Mario Rossi'},
      {name:'Francesco'},
      {name:'Michele'},
      {name:'Maria'},
  ];

  // } Dummy data

  constructor() { }

  ngOnInit() {
  }

}
