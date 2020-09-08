import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchViewComponent } from './components/dispatch-view/dispatch-view.component';
import {RouterModule, Routes} from '@angular/router';
import {AgmCoreModule, LAZY_MAPS_API_CONFIG} from '@agm/core';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {SharedModule} from '../../../../shared/shared.module';
import {DispatchViewService} from './service/dispatch-view.service';
import {IntegraaLazyMapApiLoaderService} from '../../../../shared/service/integraa-lazy-map-api-loader.service';
import {MapsAPILoader} from '@agm/core/services/maps-api-loader/maps-api-loader';

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
      {provide: MapsAPILoader, useClass: IntegraaLazyMapApiLoaderService}
  ]
})
export class DispatchViewModule { }
