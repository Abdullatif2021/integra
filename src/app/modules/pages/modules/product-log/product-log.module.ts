import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductLogComponent} from './components/product-log.component';
import {RouterModule, Routes} from '@angular/router';
import {CoreModule} from '../../../../core/core.module';
import {SharedModule} from '../../../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
    {path: '', component: ProductLogComponent}
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
    ProductLogComponent
  ]
})
export class ProductLogModule { }
