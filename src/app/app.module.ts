import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule , HttpClient} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {IntegraaPreloadingStrategy} from './core/strategy/integraa-preloading.strategy';
import {BackProcessingService} from './service/back-processing.service';
import {LocatingService} from './service/locating/locating.service';
import {GoogleGeocodeService} from './service/locating/google.geocode.service';
import {TuttocittaGeocodeService} from './service/locating/tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './service/locating/map-box.geocode.service';
import {PlanningService} from './service/planning/planning.service';
import {GoogleDirectionsService} from './service/planning/google-directions.service';
import {StreetsLocatingService} from './service/locating/streets-locating.service';
import {MapService} from './service/map.service';
import {MarkersService} from './service/markers.service';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    SharedModule,
    LoadingBarHttpClientModule,
    SnotifyModule,
    HttpClientModule,
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
  providers: [
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
      SnotifyService,
      IntegraaPreloadingStrategy,
      BackProcessingService,
      GoogleGeocodeService,
      TuttocittaGeocodeService,
      MapBoxGeocodeService,
      LocatingService,
      PlanningService,
      GoogleDirectionsService,
      StreetsLocatingService,
      MapService,
      MarkersService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
