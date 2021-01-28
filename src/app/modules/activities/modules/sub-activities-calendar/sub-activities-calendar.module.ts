import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubActivitiesCalendarComponent } from './sub-activities-calendar.component';
import { SubActivitiesCalendarPageComponent } from './components/sub-activities-calendar-page/sub-activities-calendar-page.component';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {SubActivitiesCalendarRoutingModule} from './sub-activities-calendar-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {ActivitiesService} from '../../service/activities.service';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SubActivitiesCalendarRoutingModule,
    HttpClientModule
  ],
  declarations: [
      SubActivitiesCalendarComponent,
      SubActivitiesCalendarPageComponent
  ],
  providers: [
    ActivitiesService,]
})
export class SubActivitiesCalendarModule { }
