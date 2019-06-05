import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapboxComponent} from './components/map/mapbox/mapbox.component';
import {SettingsComponent} from './settings.component';
import {ServiceTimeComponent} from './components/general/service-time/service-time.component';
import {GoogleMapsComponent} from './components/map/google-maps/google-maps.component';
import {AllCitiesComponent} from './components/map/all-cities/all-cities.component';

const routes: Routes = [
    {path: '', component: SettingsComponent, children: [
        {path: '', component: ServiceTimeComponent},
        {path: 'map-box', component: MapboxComponent},
        {path: 'google-maps', component: GoogleMapsComponent},
        {path: 'all-cities', component: AllCitiesComponent},
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
