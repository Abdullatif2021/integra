import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-service-time-input',
  templateUrl: './service-time-input.component.html',
  styleUrls: ['./service-time-input.component.css']
})
export class ServiceTimeInputComponent implements OnInit {

  @Input() setting: any ;
  @Output() deleted = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  delete(setting) {
    this.deleted.emit(this.setting) ;
  }

}
