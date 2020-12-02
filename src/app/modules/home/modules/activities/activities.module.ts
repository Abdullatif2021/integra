import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './components/activities/activities.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {ActivitiesService} from './service/activities.service';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule , HttpClient} from '@angular/common/http';

const routes = [
    { path: '', component: ActivitiesComponent},
]

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      HttpClientModule,
      RouterModule.forChild(routes),
      TranslateModule.forChild()
  ],
  declarations: [ActivitiesComponent],
  providers: [
      ActivitiesService
  ]
})
export class ActivitiesModule {}
