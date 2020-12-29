import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateNewActivityComponent} from './modals/create-new-activity/create-new-activity.component';
import {ActivityCreateService} from './service/activity-create.service';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
      CreateNewActivityComponent
  ],
  exports: [
      CreateNewActivityComponent
  ],
  providers: [
      ActivityCreateService
  ],
  entryComponents: [
      CreateNewActivityComponent
  ]
})
export class ActivitiesPartModule { }
