import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {

  constructor() { }

  // DUMMY DATA {

  items = [
      { id: 1, selected: true, marker: 'A', name: 'Bologna', warning: true, qta: 14, children: [
              { id: 1, selected: true, marker: 'A1', name: '40136', warning: true, qta: 9, children: [
                      { id: 1, selected: true, name: 'Via E. Berlinguer, 40136 Bologna (BO)', qta: 9, children: [
                              { id: 1, selected: true, name: 'Civici Pari', qta: 5, children: [
                                      { id: 1, selected: true, name: 'Via E. Berlinguer 6, 40136 Bologna (BO)', status: 1},
                                      { id: 2, selected: true, name: 'Via E. Berlinguer 8, 40136 Bologna (BO)', status: 1},
                                      { id: 3, selected: true, name: 'Via E. Berlinguer 10, 40136 Bologna (BO)', status: 1},
                                      { id: 4, selected: true, name: 'Via E. Berlinguer 16, 40136 Bologna (BO)', status: 1}
                              ]},
                              { id: 2, selected: true, name: 'Civici Dispari', qta: 4, children: [
                                      { id: 1, selected: true, name: 'Via E. Berlinguer 1, 40136 Bologna (BO)', status: 1},
                                      { id: 2, selected: true, name: 'Via E. Berlinguer 5, 40136 Bologna (BO)', status: 1},
                                      { id: 3, selected: true, name: 'Via E. Berlinguer 9, 40136 Bologna (BO)', status: 1},
                                      { id: 4, selected: true, name: 'Via E. Berlinguer 17, 40136 Bologna (BO)', status: 2}
                              ]},
                      ]}
              ]},
              { id: 2, selected: false, marker: 'A2', name: '40137', warning: true, qta: 9, children: [
                      { id: 1, selected: false, name: 'Via Del Lavoro, 40026 Sesto Imolese (BO)', qta: 9, children: [
                              { id: 1, selected: false, name: 'Civici Pari', qta: 5, children: [
                                      { id: 1, selected: false, name: 'Via E. Berlinguer 6, 40136 Bologna (BO)', status: 1},
                                      { id: 2, selected: false, name: 'Via E. Berlinguer 8, 40136 Bologna (BO)', status: 1},
                                      { id: 3, selected: false, name: 'Via E. Berlinguer 10, 40136 Bologna (BO)', status: 1},
                                      { id: 4, selected: false, name: 'Via E. Berlinguer 16, 40136 Bologna (BO)', status: 1}
                              ]},
                              { id: 2, selected: false, name: 'Civici Dispari', qta: 4, children: [
                                      { id: 1, selected: false, name: 'Via E. Berlinguer 1, 40136 Bologna (BO)'},
                                      { id: 2, selected: false, name: 'Via E. Berlinguer 5, 40136 Bologna (BO)'},
                                      { id: 3, selected: false, name: 'Via E. Berlinguer 9, 40136 Bologna (BO)'},
                                      { id: 4, selected: false, name: 'Via E. Berlinguer 17, 40136 Bologna (BO)'}
                              ]},
                      ]}
              ]},
      ]},
      { id: 2, selected: false, marker: 'B', name: 'Imola', warning: true, qta: 10, children: [
              { id: 1, selected: false, marker: 'B1', name: '40026', warning: false, qta: 5, children: [
                      { id: 1, selected: false, name: 'Via E. Berlinguer, 40136 Bologna (BO)', qta: 9, children: [
                              { id: 1, selected: false, name: 'Civici Pari', qta: 5, children: [
                                      { id: 1, selected: false, name: 'Via E. Berlinguer 6, 40136 Bologna (BO)'},
                                      { id: 2, selected: false, name: 'Via E. Berlinguer 8, 40136 Bologna (BO)'},
                                      { id: 3, selected: false, name: 'Via E. Berlinguer 10, 40136 Bologna (BO)'},
                                      { id: 4, selected: false, name: 'Via E. Berlinguer 16, 40136 Bologna (BO)'}
                              ]},
                              { id: 2, selected: false, name: 'Civici Dispari', qta: 4, children: [
                                      { id: 1, selected: false, name: 'Via E. Berlinguer 1, 40136 Bologna (BO)'},
                                      { id: 2, selected: false, name: 'Via E. Berlinguer 5, 40136 Bologna (BO)'},
                                      { id: 3, selected: false, name: 'Via E. Berlinguer 9, 40136 Bologna (BO)'},
                                      { id: 4, selected: false, name: 'Via E. Berlinguer 17, 40136 Bologna (BO)'}
                              ]},
                      ]}
              ]},
              { id: 2, selected: false, marker: 'B2', name: '40027', warning: true, qta: 9, children: [
                      { id: 1, selected: false, name: 'Via Del Lavoro, 40026 Sesto Imolese (BO)', qta: 9, children: [
                              { id: 1,  selected: false, name: 'Civici Pari', qta: 5, children: [
                                      { id: 1, selected: false, name: 'Via E. Berlinguer 6, 40136 Bologna (BO)'},
                                      { id: 2, selected: false, name: 'Via E. Berlinguer 8, 40136 Bologna (BO)'},
                                      { id: 3, selected: false, name: 'Via E. Berlinguer 10, 40136 Bologna (BO)'},
                                      { id: 4, selected: false, name: 'Via E. Berlinguer 16, 40136 Bologna (BO)'}
                              ]},
                              { id: 2, selected: false, name: 'Civici Dispari', qta: 4, children: [
                                      { id: 1, selected: false, name: 'Via E. Berlinguer 1, 40136 Bologna (BO)'},
                                      { id: 2, selected: false, name: 'Via E. Berlinguer 5, 40136 Bologna (BO)'},
                                      { id: 3, selected: false, name: 'Via E. Berlinguer 9, 40136 Bologna (BO)'},
                                      { id: 4, selected: false, name: 'Via E. Berlinguer 17, 40136 Bologna (BO)'}
                              ]},
                      ]}
              ]},
      ]}
  ]

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

  getStatusClass(item) {
      if (!item.status) {
          return '' ;
      }
      return 'status-' + item.status ;
  }
}
