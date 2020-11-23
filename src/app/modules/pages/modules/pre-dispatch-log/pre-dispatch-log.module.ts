import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PreDispatchLogComponent} from './components/pre-dispatch-log/pre-dispatch-log.component';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
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
    TranslateModule.forChild()
  ],
  declarations: [
      PreDispatchLogComponent
  ]
})
export class PreDispatchLogModule { }
