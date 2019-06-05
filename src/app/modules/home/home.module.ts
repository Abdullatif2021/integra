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

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
      ToDeliverComponent,
      PreDispatchComponent,
      DispatchComponent,
      DeliveringComponent,
      InStockComponent,
      NotDeliveredComponent,
      HomeComponent,
  ],
  exports: [
      HomeComponent,
      HomeRoutingModule
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
