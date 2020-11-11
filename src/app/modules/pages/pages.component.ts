import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(  private translate: TranslateService,
    ) {
        translate.setDefaultLang('itly');
        const browserLang = translate.getBrowserLang();
      }


  ngOnInit() {
  }

}
