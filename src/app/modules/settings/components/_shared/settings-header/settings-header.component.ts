import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.css']
})
export class SettingsHeaderComponent implements OnInit {

  constructor( private translate: TranslateService,
    ) {}

  @Output() create = new EventEmitter();
  @Input() create_btn = true ;
  ngOnInit() {
  }

  back() {
    window.history.back();
  }

}
