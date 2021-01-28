import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {SubActivitiesCalendarComponent} from './sub-activities-calendar.component';
import {SubActivitiesCalendarPageComponent} from './components/sub-activities-calendar-page/sub-activities-calendar-page.component';

const routes: Routes = [
    {path: '', component: SubActivitiesCalendarComponent, children: [
            {path: '', component: SubActivitiesCalendarPageComponent}
    ]}
];


@NgModule({
    imports: [RouterModule.forChild(routes) , TranslateModule],
    exports: [RouterModule , TranslateModule]
})
export class SubActivitiesCalendarRoutingModule { }
