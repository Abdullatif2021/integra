import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule , HttpClient} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => {
      return new TranslateHttpLoader(http, './assets/i18n/', '.json');
      },
      deps: [HttpClient],
      },
      })
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
