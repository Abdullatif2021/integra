import { itl } from './../../assets/i18n/itl';
import { Injectable } from '@angular/core';
import { setting } from 'src/app/config/setting';

@Injectable({ providedIn: 'root' })
export class OwnTranslateService {
  constructor() {}

  public translate(key): any {
    const keysChain = key.split('.');
    let currentObjState = itl;
    // will set from local storage when support multi labguage
    switch (setting.lang){
        case 'en' : break;
        default : currentObjState = itl; }
        for ( key of keysChain) {
        if (typeof currentObjState !== 'object') {
            break ;
        }
        currentObjState = currentObjState[key];
    }

    return typeof currentObjState === 'string' ? `${currentObjState}` : key;
  }
}
