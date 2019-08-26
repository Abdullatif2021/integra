import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor() { }

  // DUMMY DATA {
  items = [
      {date: '21/03/2019', children: [
          {name: 'Botta Raffaele', count: '185 Consegne', time: '7 Ore 37 Min.', distance: '1000 Km', children: [
              {name: 'Bologna', marker: 'A', count: '185 Consegne', time: '7 Ore 37 Min.', distance: '1000 Km', children: [
                      {name: '40136', marker: 'A1', count: '105 Consegne', time: '4 Ore 37 Min.', distance: '600 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                      {name: '40137', marker: 'A2', count: '85 Consegne', time: '3 Ore 0 Min.', distance: '400 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                  ]},
          ]},
          {name: 'Botta Raffaele', count: '175 Consegne', time: '7 Ore 48 Min.', distance: '900 Km', children: [
              {name: 'Imola', marker: 'A', count: '185 Consegne', time: '2 Ore 40 Min.', distance: '250 Km', children: [
                      {name: '40026', marker: 'A1', count: '75 Consegne', time: '4 Ore 37 Min.', distance: '600 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                      {name: '40027', marker: 'A2', count: '60 Consegne', time: '3 Ore 05 Min.', distance: '150 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                  ]},
              {name: 'Sesto Imole.', marker: 'B', count: '185 Consegne', time: '2 Ore 40 Min.', distance: '250 Km', children: [
                  {name: '40028', marker: 'B1', count: '75 Consegne', time: '4 Ore 37 Min.', distance: '600 Km', children: [
                      {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                      {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                      {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                      {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                  ]},
              ]},
          ]}
      ]},
      {date: '23/03/2019', children: [
          {name: 'Turco Luca', count: '190 Consegne', time: '7 Ore 37 Min.', distance: '1000 Km', children: [
              {name: 'Bologna', count: '185 Consegne', time: '7 Ore 37 Min.', distance: '1000 Km', children: [
                      {name: '40136', count: '105 Consegne', time: '4 Ore 37 Min.', distance: '600 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                      {name: '40137', count: '85 Consegne', time: '3 Ore 0 Min.', distance: '400 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                  ]},
          ]},
          {name: 'Rocco', count: '200 Consegne', time: '7 Ore 48 Min.', distance: '900 Km', children: [
              {name: 'Imola', count: '185 Consegne', time: '2 Ore 40 Min.', distance: '250 Km', children: [
                      {name: '40026', count: '75 Consegne', time: '4 Ore 37 Min.', distance: '600 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                      {name: '40027', count: '60 Consegne', time: '3 Ore 05 Min.', distance: '150 Km', children: [
                              {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                              {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                              {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                              {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                          ]},
                  ]},
              {name: 'Sesto Imole.', count: '185 Consegne', time: '2 Ore 40 Min.', distance: '250 Km', children: [
                  {name: '40028', count: '75 Consegne', time: '4 Ore 37 Min.', distance: '600 Km', children: [
                      {address: 'Via Rivabella, 40136 Bologna (BO)', time: '08:29 (+0:29)', srv: '0:02', distance: '38.95 (38.95)'},
                      {address: 'Via del lavoro, 40136 Bologna (BO)', time: '08:31 (+0:09)', srv: '0:10', distance: '45.60 (06.6)'},
                      {address: 'Via Strada 1, 40136 Bologna (BO)', time: '09:00 (+0:19)', srv: '0:05', distance: '38.95 (38.95)'},
                      {address: 'Via Strada 2, 40136 Bologna (BO)', time: '09:15 (+0:10)', srv: '0:07', distance: '45.60 (06.65)'},
                  ]},
              ]},
          ]}
      ]},
  ];
  // } DUMMY DATA
  expanded = {} ;

  ngOnInit() {
  }

  more(next) {
      if (! this.expanded[next]) {
          this.expanded[next] = true ;
      } else {
          this.expanded[next] = false ;
      }
  }


  getChildren(next) {
      if (!this.expanded[next]) {
          return;
      }
      const location = (next + '').split(':');
      let child = this.items[location[0]].children ;
      for (let i = 1; i < location.length; ++i) {
          child = child[location[i]].children ;
      }
      return child;
  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
  }
  getLvl(next) {
      return (next + '').split(':').length;
  }

  getStatusClass(item) {
      if (!item.status) {
          return '' ;
      }
      return 'status-' + item.status ;
  }
}
