import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {SettingsRoutingModule} from './settings-routing.module';
import { MapboxComponent } from './components/map/mapbox/mapbox.component';
import { ServiceTimeComponent } from './components/general/service-time/service-time.component';
import { GoogleMapsComponent } from './components/map/google-maps/google-maps.component';
import { AllCitiesComponent } from './components/map/all-cities/all-cities.component';
import { SettingsHeaderComponent } from './components/_shared/settings-header/settings-header.component';
import { MapApiInputComponent } from './components/_shared/map-api-input/map-api-input.component';
import { ServiceTimeInputComponent } from './components/_shared/service-time-input/service-time-input.component';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    SettingsRoutingModule,
    NgSelectModule
  ],
  declarations: [
      SettingsComponent,
      MapboxComponent,
      ServiceTimeComponent,
      GoogleMapsComponent,
      AllCitiesComponent,
      SettingsHeaderComponent,
      MapApiInputComponent,
      ServiceTimeInputComponent,
  ]
})
export class SettingsModule { }
