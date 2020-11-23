import { NgModule , CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DispatchLogComponent} from './components/dispatch-log/dispatch-log.component';
import {RouterModule, Routes} from '@angular/router';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule , HttpClient} from '@angular/common/http';

const routes: Routes = [
    {path: '', component: DispatchLogComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CoreModule,
    FontAwesomeModule,
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
      DispatchLogComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DispatchLogModule { }
