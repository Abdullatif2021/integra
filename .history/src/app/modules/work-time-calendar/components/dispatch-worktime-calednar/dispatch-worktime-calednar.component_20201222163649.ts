import { Component, OnInit } from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';

@Component({
  selector: 'app-dispatch-worktime-calednar',
  templateUrl: './dispatch-worktime-calednar.component.html',
  styleUrls: ['./dispatch-worktime-calednar.component.css']
})
export class DispatchWorktimeCalednarComponent implements OnInit {


  postmenTableConfig = TablesConfig.simpleTable.postmenTable;
  config = {
      days: 7,
      icon: '/assets/images/postman-icon.png',
      text: 'name',
      group_name: 'state'
  };

  data = [
      {
          state: 'da_fare',
          items: [
              {name: 'Postman 1', days: ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-05', '2020-01-06']},
              {name: 'Postman 2', days: ['2020-01-01', '2020-01-02']},
              {name: 'Postman 2', days: ['2020-01-02']},
          ]
      },
      {
          state: 'other_thing',
          items: [
              {name: 'Postman 3', days: ['2020-01-05', '2020-01-06']},
              {name: 'Postman 4', days: ['2020-01-05', '2020-01-06']},
          ]
      }
  ];

  baseDate = '2020-01-01';


  constructor() { }

  ngOnInit() {
  }

}
