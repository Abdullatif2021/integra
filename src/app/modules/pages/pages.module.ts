import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight, faChevronUp} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
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
