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
import {
    faAllergies,
    faCheckCircle, faExclamationCircle,
    faExclamationTriangle,
    faMapMarkedAlt,
    faMapMarkerAlt, faMinus,
} from '@fortawesome/free-solid-svg-icons';
import {ListTreeService} from './service/list-tree.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ContextMenuModule, ContextMenuService} from 'ngx-contextmenu';
import {faSync} from '@fortawesome/free-solid-svg-icons/faSync';
import { ToPlanComponent } from './components/to-plan/to-plan.component';
import {AddressesActionsService} from './service/addresses.actions.service';
import {PreDispatchDataResolver} from './resolvers/pre-dispatch-data.resolver';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MapService} from './service/map.service';
import {ResultsService} from './service/results.service';
import {ResultesResolver} from './resolvers/resultes.resolver';
import {ScheduleService} from './service/schedule.service';
import { NotMatchesTreeComponent } from './parts-components/not-matches-tree/not-matches-tree.component';
import {DndModule} from 'ngx-drag-drop';
import {MarkersService} from './service/markers.service';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NotFixedTreeComponent } from './parts-components/not-fixed-tree/not-fixed-tree.component';


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
    ContextMenuModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
  ],
  declarations: [
      ScheduleComponent,
      AddressesComponent,
      ParametersComponent,
      ResultComponent,
      ToPlanComponent,
      NotMatchesTreeComponent,
      NotFixedTreeComponent,
  ],
  exports: [
      ScheduleRoutingModule
  ],
  providers: [
      ListTreeService,
      ContextMenuService,
      AddressesActionsService,
      PreDispatchDataResolver,
      MapService,
      ResultsService,
      ResultesResolver,
      ScheduleService,
      MarkersService,
  ],
  entryComponents: [
      NotMatchesTreeComponent,
      NotFixedTreeComponent
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
        library.add(faSync);
        library.add(faCheckCircle);
        library.add(faMapMarkerAlt);
        library.add(faMapMarkedAlt);
        library.add(faMinus);
        library.add(faExclamationCircle);

    }
}
