import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './schedule.component';
import {AddressesComponent} from './components/addresses/addresses.component';

const routes: Routes = [
    {path: '', component: ScheduleComponent, children: [
            {path: '', component: AddressesComponent},
        ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class ScheduleRoutingModule { }

