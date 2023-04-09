import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {DeliveringCalenderComponent} from './component/delivering-calender/delivering-calender.component';

const routes = [
    { path: '', component: DeliveringCalenderComponent},
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [DeliveringCalenderComponent]
})
export class DeliveringCalenderModule { }
