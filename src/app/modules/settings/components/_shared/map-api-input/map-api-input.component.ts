import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-map-api-input',
  templateUrl: './map-api-input.component.html',
  styleUrls: ['./map-api-input.component.css']
})

export class MapApiInputComponent implements OnInit {

  @Input() setting: any ;
  @Output() deleted = new EventEmitter() ;
  constructor() { }

  ngOnInit() {
  }

  delete(setting) {
    this.deleted.emit(this.setting) ;
  }

}
