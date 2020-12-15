import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    SummaryRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [SummaryViewComponent, SummaryComponent]
})
export class SummaryModule { }
