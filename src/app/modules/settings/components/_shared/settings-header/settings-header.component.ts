import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../../service/translate-selector-service';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.css']
})
export class SettingsHeaderComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private translateSelectorService: TranslateSelectorService,
    ) {
        this.translateSelectorService.setDefaultLanuage();
    }

  @Output() create = new EventEmitter();
  @Input() create_btn = true ;
  ngOnInit() {
  }

  back() {
    window.history.back();
  }

}
