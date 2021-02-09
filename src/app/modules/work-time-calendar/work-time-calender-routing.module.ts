import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {WorkTimeCalendarComponent} from './work-time-calendar.component';
import {DispatchWorktimeCalednarComponent} from './components/dispatch-worktime-calednar/dispatch-worktime-calednar.component';

const routes: Routes = [
    {path: '', component: WorkTimeCalendarComponent, children: [
            {path: 'dispatch', component: DispatchWorktimeCalednarComponent}
    ]}
];


@NgModule({
    imports: [RouterModule.forChild(routes) , TranslateModule],
    exports: [RouterModule , TranslateModule]
})
export class WorkTimeCalenderRoutingModule { }
