import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {OwnTranslateService} from 'src/app/service/translate.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {

  constructor(private translate: TranslateService) {
      translate.setDefaultLang('itly');
  }

  ngOnInit() {

  }

}
