import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateSelectorService } from '../../../service/translate-selector-service';

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

  constructor(private translateService: TranslateService, selectConf: TranslateSelectorService, private router: Router) {
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
  reloadLanguage(language: string) {
    this.translateService.use(language);
    this.translateService.setDefaultLang(language);
    const prev = this.router.url;
    this.router.navigate(['/']).then(data => {
      this.router.navigate([prev]);
    });
  }

}
