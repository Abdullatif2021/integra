import { ActionsService } from './../../../../service/actions.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PreDispatchProductsComponent} from './components/pre-dispatch-products/pre-dispatch-products.component';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
    {path: '', component: PreDispatchProductsComponent}
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
      PreDispatchProductsComponent
  ]
})
export class PreDispatchProductsModule { }
