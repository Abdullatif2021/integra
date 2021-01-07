import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkTimeCalendarComponent } from './work-time-calendar.component';
import { DispatchWorktimeCalednarComponent } from './components/dispatch-worktime-calednar/dispatch-worktime-calednar.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {WorkTimeCalenderRoutingModule} from './work-time-calender-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {ActivitiesService} from '../activities/service/activities.service'
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    WorkTimeCalenderRoutingModule,
    HttpClientModule
  ],
  declarations: [
      WorkTimeCalendarComponent,
      DispatchWorktimeCalednarComponent
  ],
  providers: [
    ActivitiesService,]
})
export class WorkTimeCalendarModule { }
