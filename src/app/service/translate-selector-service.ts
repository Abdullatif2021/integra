import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateSelectorService {

  currentLang = 'Italy';
  translateService: TranslateService;

  setSelectedLanguage(language) {
    this.currentLang = language;
    this.applyLanguage(this.currentLang);
  }
  private applyLanguage(language) {
    this.translateService.use(language);
  }
  getLanguages() {
    return this.translateService.getLangs();
  }
  constructor(translateService: TranslateService) {
    this.translateService = translateService;
  }

  setUpConf() {
    this.translateService.addLangs(['Italy', 'English']);
    this.translateService.setDefaultLang(this.currentLang);
    this.applyLanguage(this.currentLang);
  }
}
