import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './schedule.component';
import {AddressesComponent} from './components/addresses/addresses.component';
import {ParametersComponent} from './components/parameters/parameters.component';
import {ResultComponent} from './components/result/result.component';
import {ToPlanComponent} from './components/to-plan/to-plan.component';

const routes: Routes = [
    {path: '', component: ScheduleComponent, children: [
            {path: '', component: AddressesComponent},
            {path: 'parameters', component: ParametersComponent},
            {path: 'result', component: ResultComponent},
            {path: 'toPlan', component: ToPlanComponent},
        ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class ScheduleRoutingModule { }

