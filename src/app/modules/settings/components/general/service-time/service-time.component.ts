import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-time',
  templateUrl: './service-time.component.html',
  styleUrls: ['./service-time.component.css']
})
export class ServiceTimeComponent implements OnInit {

  constructor() { }
  counter = -9999 ;
  // DUMMY DATA {

  settings = [
      {id: 1, product: '', single_service_time: 2, multiple_service_time: 10  },
  ];

  // } DUMMY DATA


  ngOnInit() {
  }

  delete(setting) {
    this.settings = this.settings.filter((elm) => {
      return setting.id !== elm.id ;
    });
  }

  create() {
    this.counter++ ;
    this.settings.push({id: this.counter, product: '', single_service_time: 0, multiple_service_time: 0});
  }
}
