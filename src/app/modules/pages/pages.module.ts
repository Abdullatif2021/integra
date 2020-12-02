import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild()
  ],
  declarations: [
      PagesComponent,
  ],
  exports: [
      PagesRoutingModule,
  ]
})
export class PagesModule {
    constructor() {
        library.add(faChevronRight);
        library.add(faChevronUp);
    }

}
