import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchCalenderComponent } from './component/dispatch-calender/dispatch-calender.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';

const routes = [
    { path: '', component: DispatchCalenderComponent},
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [DispatchCalenderComponent]
})
export class DispatchCalenderModule { }
