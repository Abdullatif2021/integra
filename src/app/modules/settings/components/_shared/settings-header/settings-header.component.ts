import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.css']
})
export class SettingsHeaderComponent implements OnInit {

  constructor() { }

  @Output() create = new EventEmitter();

  ngOnInit() {
  }

  back() {
    window.history.back();
  }

}
