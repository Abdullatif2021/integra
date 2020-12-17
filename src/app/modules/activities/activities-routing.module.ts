import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {ActivitiesComponent} from './activities.component';
import {ListActivitiesComponent} from './components/list-activities/list-activities.component';


const routes: Routes = [
    {path: '', component: ActivitiesComponent, children: [
            {path: '', component: ListActivitiesComponent}
    ]}
];


@NgModule({
    imports: [RouterModule.forChild(routes) , TranslateModule],
    exports: [RouterModule , TranslateModule]
})
export class ActivitiesRoutingModule { }
