import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PreDispatchLogComponent} from './components/pre-dispatch-log/pre-dispatch-log.component';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule , HttpClient} from '@angular/common/http';
const routes: Routes = [
    {path: '', component: PreDispatchLogComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CoreModule,
    FontAwesomeModule,
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
  declarations: [
      PreDispatchLogComponent
  ]
})
export class PreDispatchLogModule { }
