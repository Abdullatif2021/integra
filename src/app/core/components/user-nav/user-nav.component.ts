import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateSelectorService } from '../../../service/translate-selector-service';
import * as FriendCard from '../../../../assets/js/flag-dropdwopn.js';
@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  selectConf: TranslateSelectorService;
  selectedLanguage = '';
  selectedLanguageFlag = '';
  selectflag = [];

  constructor(private translate: TranslateService, selectConf: TranslateSelectorService) {
    this.selectConf = selectConf;
    this.selectConf.setUpConf();

  }

  ngOnInit() {
    this.selectflag = this.selectConf.getLanguagesWithFlags();
    this.selectedLanguage = this.selectConf.currentLang;
    this.selectConf.getLanguagesWithFlags().forEach(langauge => {
      if (langauge.label === this.selectedLanguage) {
        this.selectedLanguageFlag = langauge.flag;
      }
    });
  }

  selectChanged(event) {
    this.selectedLanguage = event.label;
    this.selectedLanguageFlag = event.flag;
    this.selectConf.setSelectedLanguage(this.selectedLanguage);
  }

}
