import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ActivitiesService} from './service/activities.service';
import {TranslateModule} from '@ngx-translate/core';
import { HttpClientModule} from '@angular/common/http';
import {ActivityDeleteComponent} from './modals/activity-delete/activity-delete.component';
import {ChangeSubActivityStatusModalComponent} from './modals/change-subactivity-status/change-subactivity-status.componant';
import {ActivityActionsService} from './service/activity-action.service';
import { ListActivitiesComponent } from './components/list-activities/list-activities.component';
import {ActivitiesRoutingModule} from './activities-routing.module';
import {CoreModule} from '../../core/core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';


@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      NgbModule,
      FormsModule,
      HttpClientModule,
      NgSelectModule,
      ActivitiesRoutingModule,
      CoreModule,
      TranslateModule.forChild()
  ],
  declarations: [
      ActivitiesComponent,
      ActivityDeleteComponent,
      ListActivitiesComponent,
      ChangeSubActivityStatusModalComponent
  ],
  providers: [
      ActivitiesService,
      ActivityActionsService
  ],
  entryComponents: [
      ActivityDeleteComponent,
      ChangeSubActivityStatusModalComponent
  ],
})
export class ActivitiesModule {}
