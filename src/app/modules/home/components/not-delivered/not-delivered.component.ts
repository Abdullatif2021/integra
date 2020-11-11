import { Component, OnInit } from '@angular/core';
import { TablesConfig } from '../../../../config/tables.config';
import { OwnTranslateService } from './../../../../service/translate.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-not-deliverd',
  templateUrl: './not-delivered.component.html',
  styleUrls: ['./not-delivered.component.css']
})
export class NotDeliveredComponent implements OnInit {

  constructor(private translate: TranslateService,public translateService: OwnTranslateService) 
  {
    translate.setDefaultLang('itly');
    const browserLang = translate.getBrowserLang();
  }

  productsTable = TablesConfig.table.productsTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;

  ngOnInit() {
  }

}
