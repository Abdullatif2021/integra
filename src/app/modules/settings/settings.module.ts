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
import { PaginationOptionsComponent } from './components/general/pagination-options/pagination-options.component';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule , HttpClient} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    SettingsRoutingModule,
    NgSelectModule,
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
      SettingsComponent,
      ServiceTimeComponent,
      SettingsHeaderComponent,
      MapsComponent,
      PaginationOptionsComponent,
  ]
})
export class SettingsModule { }
