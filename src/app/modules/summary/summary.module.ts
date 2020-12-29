import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {ActivitiesPartModule} from '../../parts/activities-part/activities-part.module';

@NgModule({
  imports: [
    CommonModule,
    SummaryRoutingModule,
    SharedModule,
    CoreModule,
    ActivitiesPartModule
  ],
  declarations: [SummaryViewComponent, SummaryComponent]
})
export class SummaryModule { }
