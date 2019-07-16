import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {SettingsRoutingModule} from './settings-routing.module';
import { ServiceTimeComponent } from './components/general/service-time/service-time.component';
import { SettingsHeaderComponent } from './components/_shared/settings-header/settings-header.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { MapsComponent } from './components/map/maps/maps.component';

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
      ServiceTimeComponent,
      SettingsHeaderComponent,
      MapsComponent,
  ]
})
export class SettingsModule { }
