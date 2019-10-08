import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import {ScheduleRoutingModule} from './schedule-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import { AgmCoreModule } from '@agm/core';
import { AddressesComponent } from './components/addresses/addresses.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {faSortDown} from '@fortawesome/free-solid-svg-icons/faSortDown';
import { ParametersComponent } from './components/parameters/parameters.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { ResultComponent } from './components/result/result.component';
import {LocatingService} from './service/locating.service';
import {GoogleGeocodeService} from './service/google.geocode.service';
import {TuttocittaGeocodeService} from './service/tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './service/map-box.geocode.service';
import {faAllergies, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {ListTreeService} from './service/list-tree.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {DndModule} from 'ngx-drag-drop';
import {ContextMenuModule, ContextMenuService} from 'ngx-contextmenu';

@NgModule({
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    SharedModule,
    FontAwesomeModule,
    CoreModule,
    // TODO get apiKey From google api key settings.
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'
    }),
    NgSelectModule,
    InfiniteScrollModule,
    DndModule,
    ContextMenuModule

  ],
  declarations: [
      ScheduleComponent,
      AddressesComponent,
      ParametersComponent,
      ResultComponent,
  ],
  exports: [
      ScheduleRoutingModule
  ],
  providers: [
      LocatingService,
      GoogleGeocodeService,
      TuttocittaGeocodeService,
      MapBoxGeocodeService,
      ListTreeService,
      ContextMenuService,
  ],


})
export class ScheduleModule {
    constructor() {
        library.add(faChevronUp);
        library.add(faChevronDown);
        library.add(faCheck);
        library.add(faSortDown);
        library.add(faExclamationTriangle);
        library.add(faAllergies);
    }
}
