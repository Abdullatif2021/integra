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

@NgModule({
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    SharedModule,
    FontAwesomeModule,
    CoreModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'
    }),
    NgSelectModule
  ],
  declarations: [ScheduleComponent, AddressesComponent, ParametersComponent, ResultComponent],
  exports: [
      ScheduleRoutingModule
  ]
})
export class ScheduleModule {
    constructor() {
        library.add(faChevronUp);
        library.add(faChevronDown);
        library.add(faCheck);
        library.add(faSortDown);
    }
}
