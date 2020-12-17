import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ActivitiesService} from './service/activities.service';
import {TranslateModule} from '@ngx-translate/core';
import { HttpClientModule} from '@angular/common/http';
import {ActivityDeleteComponent} from './modals/activity-delete/activity-delete.component';
import {ActivityActionsService} from './service/activity-action.service';
import { ListActivitiesComponent } from './components/list-activities/list-activities.component';
import {ActivitiesRoutingModule} from './activities-routing.module';
import {CoreModule} from '../../core/core.module';


@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      HttpClientModule,
      ActivitiesRoutingModule,
      CoreModule,
      TranslateModule.forChild()
  ],
  declarations: [
      ActivitiesComponent,
      ActivityDeleteComponent,
      ListActivitiesComponent
  ],
  providers: [
      ActivitiesService,
      ActivityActionsService
  ],
  entryComponents: [
      ActivityDeleteComponent
  ],
})
export class ActivitiesModule {}
