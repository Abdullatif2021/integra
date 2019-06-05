import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css']
})
export class MapboxComponent implements OnInit {

  constructor() { }
  counter = -9999 ;
  // DUMMY DATA {

  settings = [
      {id: 1, key: '4321rjifiorjtus7934543ifuhsi342548956546ygdf', daily_limit: 1000, monthly_limit: 50000},
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
