import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchViewComponent } from './components/dispatch-view/dispatch-view.component';
import {RouterModule, Routes} from '@angular/router';
import {AgmCoreModule, LAZY_MAPS_API_CONFIG} from '@agm/core';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {SharedModule} from '../../../../shared/shared.module';
import {GoogleMapsConfig} from '../../../schedule/service/google-maps-config';
import {DispatchViewService} from './service/dispatch-view.service';

const routes: Routes = [
    {path: '', component: DispatchViewComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot(),
    InfiniteScrollModule,
    SharedModule
  ],
  declarations: [DispatchViewComponent],
  providers: [
      DispatchViewService,
      {provide: LAZY_MAPS_API_CONFIG, useClass: GoogleMapsConfig}
  ]
})
export class DispatchViewModule { }
