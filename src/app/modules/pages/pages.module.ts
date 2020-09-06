import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { PagesComponent } from './pages.component';
import { PreDispatchProductsComponent } from './components/pre-dispatch-products/pre-dispatch-products.component';
import {PagesRoutingModule} from './pages-routing.module';
import { PreDispatchLogComponent } from './components/pre-dispatch-log/pre-dispatch-log.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import { DispatchLogComponent } from './components/dispatch-log/dispatch-log.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    PagesRoutingModule,
    FontAwesomeModule
  ],
  declarations: [
      PagesComponent,
      PreDispatchProductsComponent,
      PreDispatchLogComponent,
      DispatchLogComponent
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
