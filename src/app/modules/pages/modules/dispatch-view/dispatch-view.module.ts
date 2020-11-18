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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {DndModule} from 'ngx-drag-drop';
import {CoreModule} from '../../../../core/core.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';

const routes: Routes = [
    {path: '', component: DispatchViewComponent}
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot(),
    InfiniteScrollModule,
    FontAwesomeModule,
    SharedModule,
    DndModule,
    NgSelectModule,
    FormsModule,
    TranslateModule.forRoot({
        loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
        return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient],
        },
        })
  ],
  declarations: [DispatchViewComponent],
  providers: [
      DispatchViewService,
      {provide: MapsAPILoader, useClass: IntegraaLazyMapApiLoaderService}
  ],
})
export class DispatchViewModule {
    constructor() {
        library.add(faChevronUp);
        library.add(faChevronDown);
        library.add(faCheck);
    }
}
