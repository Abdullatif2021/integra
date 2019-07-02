import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDeliverComponent } from './components/to-deliver/to-deliver.component';
import { PreDispatchComponent } from './components/pre-dispatch/pre-dispatch.component';
import { DispatchComponent } from './components/dispatch/dispatch.component';
import { DeliveringComponent } from './components/delivering/delivering.component';
import { InStockComponent } from './components/in-stock/in-stock.component';
import { NotDeliveredComponent } from './components/not-delivered/not-delivered.component';
import { HomeComponent } from './home.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { PreDispatchAddComponent } from './modals/pre-dispatch-add/pre-dispatch-add.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PreDispatchNewComponent } from './modals/pre-dispatch-new/pre-dispatch-new.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule,
    NgSelectModule
  ],
  declarations: [
      ToDeliverComponent,
      PreDispatchComponent,
      DispatchComponent,
      DeliveringComponent,
      InStockComponent,
      NotDeliveredComponent,
      HomeComponent,
      PreDispatchAddComponent,
      PreDispatchNewComponent,
  ],
  exports: [
      HomeComponent,
      HomeRoutingModule
  ],
  bootstrap: [HomeComponent],
  entryComponents: [PreDispatchAddComponent,PreDispatchNewComponent],

})
export class HomeModule { }
