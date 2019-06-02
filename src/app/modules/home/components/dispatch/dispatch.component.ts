import { Component, OnInit } from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})
export class DispatchComponent implements OnInit {

  dispatchTable = TablesConfig.table.dispatchTable ;
  postmenTable = TablesConfig.simpleTable.postmenTable ;

  // Dummy Data {
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
