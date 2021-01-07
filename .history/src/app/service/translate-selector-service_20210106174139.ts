import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export interface FlagLanguage {
  label: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslateSelectorService {

  // currentLang = 'Italy';
  currentLang = localStorage.getItem('language') || 'It';
  translateService: TranslateService;

  setDefaultLanuage() {
    if (!this.currentLang || this.currentLang == null) {this.currentLang = 'It'; }
    this.applyLanguage(this.currentLang);
  }

  setSelectedLanguage(language) {
    this.currentLang = language;
    localStorage.setItem('language', language);
    this.applyLanguage(this.currentLang);
  }
  public applyLanguage(language) {
    this.translateService.use(language);
  }
  getLanguages() {
    return this.translateService.getLangs();
  }
  constructor(translateService: TranslateService) {
    this.translateService = translateService;
  }

  setUpConf() {
    this.translateService.addLangs(this.getStringLanguages());
    this.translateService.setDefaultLang(this.currentLang);
    this.applyLanguage(this.currentLang);
  }

  getLanguagesWithFlags(): FlagLanguage[] {
    const array: FlagLanguage[] = [];
    const english: FlagLanguage = { label: 'En', flag: 'assets/images/uk.png' };
    const italy: FlagLanguage = { label: 'It', flag: 'assets/images/it.png' };
    array.push(english);
    array.push(italy);
    return array;
  }

  getStringLanguages(): string[] {
    const array: FlagLanguage[] = this.getLanguagesWithFlags();
    const stringArray: string[] = [];
    array.forEach(language => stringArray.push(language.label));
    return stringArray;
  }
}
