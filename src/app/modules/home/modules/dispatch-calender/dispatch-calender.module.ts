import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchCalenderComponent } from './component/dispatch-calender/dispatch-calender.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';


const routes = [
    { path: '', component: DispatchCalenderComponent},
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DispatchCalenderComponent]
})
export class DispatchCalenderModule { }
