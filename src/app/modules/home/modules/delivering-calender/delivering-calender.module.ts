import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {DeliveringCalenderComponent} from './component/delivering-calender/delivering-calender.component';
import {TranslateModule, TranslateLoader , TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
const routes = [
    { path: '', component: DeliveringCalenderComponent},
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild()
    ],
    declarations: [DeliveringCalenderComponent]
})
export class DeliveringCalenderModule { }
