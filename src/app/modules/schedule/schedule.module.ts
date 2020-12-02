import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import {ScheduleRoutingModule} from './schedule-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
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
import {ResultsService} from './service/results.service';
import {ResultesResolver} from './resolvers/resultes.resolver';
import {ScheduleService} from './service/schedule.service';
import { NotMatchesTreeComponent } from './parts-components/not-matches-tree/not-matches-tree.component';
import {DndModule} from 'ngx-drag-drop';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NotFixedTreeComponent } from './parts-components/not-fixed-tree/not-fixed-tree.component';
import {IntegraaLazyMapApiLoaderService} from '../../shared/service/integraa-lazy-map-api-loader.service';
import {MapsAPILoader} from '@agm/core/services/maps-api-loader/maps-api-loader';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule , HttpClient} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    SharedModule,
    FontAwesomeModule,
    CoreModule,
    AgmCoreModule.forRoot(),
    NgSelectModule,
    InfiniteScrollModule,
    DndModule,
    ContextMenuModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    TranslateModule.forChild({
        loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
        return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient],
        },
        })
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
      ResultsService,
      ResultesResolver,
      ScheduleService,
      {provide: MapsAPILoader, useClass: IntegraaLazyMapApiLoaderService}
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
