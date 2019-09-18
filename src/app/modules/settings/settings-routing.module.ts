    import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ServiceTimeComponent } from './components/general/service-time/service-time.component';
import { MapsComponent } from './components/map/maps/maps.component';
import { SettingsResolver } from './resolvers/SettingsResolver';
    import {PaginationOptionsComponent} from './components/general/pagination-options/pagination-options.component';

const routes: Routes = [
    {path: '', component: SettingsComponent, resolve: {res: SettingsResolver}, children: [
        {path: '', component: ServiceTimeComponent},
        {path: 'map/:provider', component: MapsComponent},
        {path: 'pagination', component: PaginationOptionsComponent},
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
