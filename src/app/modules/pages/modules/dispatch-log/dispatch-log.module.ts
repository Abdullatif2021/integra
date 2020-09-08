import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DispatchLogComponent} from './components/dispatch-log/dispatch-log.component';
import {RouterModule, Routes} from '@angular/router';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

const routes: Routes = [
    {path: '', component: DispatchLogComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CoreModule,
    FontAwesomeModule
  ],
  declarations: [
      DispatchLogComponent
  ]
})
export class DispatchLogModule { }
