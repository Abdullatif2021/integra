import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.css']
})
export class SettingsHeaderComponent implements OnInit {

  constructor() { }

  @Output() create = new EventEmitter();
  @Input() create_btn = true ;
  ngOnInit() {
  }

  back() {
    window.history.back();
  }

}
