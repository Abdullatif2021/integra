import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {

  constructor() { }
  counter = -9999 ;
  // DUMMY DATA {

  settings = [
      {id: 1, key: '4321rjifiorjtus7934543ifuhsi342548956546ygdf', daily_limit: 1000, monthly_limit: 50000},
      {id: 2, key: '4321rjifiorjtus7934543ifuhsi342548956546ygdf', daily_limit: 1000, monthly_limit: 50000},
      {id: 3, key: '4321rjifiorjtus7934543ifuhsi342548956546ygdf', daily_limit: 1000, monthly_limit: 50000},
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
      this.settings.push({id: this.counter, key: '', daily_limit: 0, monthly_limit: 0});
  }
}
