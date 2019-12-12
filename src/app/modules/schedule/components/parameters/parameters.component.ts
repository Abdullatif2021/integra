import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  formatTime(e) {
    let time = e.target.value.split(':') ;
    time.length < 2 ? time.push('00') : (time.length > 2 ? time = [time[0], time[1]] : time = time);
    time = time.map((v, j) => {
        v = v.replace(/\s/g, '');
        v = parseInt(v, 10) ? (v.length > 2 ? v[0] + v[1] : v) : '00';
        v = v > (j ? 60 : 24) || v < 0 ? (v > (j ? 60 : 24) ? (j ? '60' : '24') : '00') : v;
        return v.length === 1 ? '0' + v : v ;
    });
    e.target.value = time.join(':') ;
    return e;
  }

}
