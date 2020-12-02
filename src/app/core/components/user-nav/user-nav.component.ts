import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../service/translate-selector-service';
@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  selectConf: TranslateSelectorService;
   constructor(private translate: TranslateService , selectConf: TranslateSelectorService) {

      this.selectConf = selectConf;
      this.selectConf.setUpConf();
   }
  ngOnInit() {

  }

}
