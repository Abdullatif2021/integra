import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './components/activities/activities.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {ActivitiesService} from './service/activities.service';


const routes = [
    { path: '', component: ActivitiesComponent},
]

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(routes),
  ],
  declarations: [ActivitiesComponent],
  providers: [
      ActivitiesService
  ]
})
export class ActivitiesModule {}
