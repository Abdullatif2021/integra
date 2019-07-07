import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { PagesComponent } from './pages.component';
import { PreDispatchProductsComponent } from './components/pre-dispatch-products/pre-dispatch-products.component';
import {PagesRoutingModule} from './pages-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    PagesRoutingModule
  ],
  declarations: [
      PagesComponent,
      PreDispatchProductsComponent
  ],
  exports: [
      PagesRoutingModule
  ]
})
export class PagesModule { }
