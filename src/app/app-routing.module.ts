import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './modules/home/home.component';
import { routes as home_routes } from './modules/home/home-routing.module';

const routes: Routes = [
    {path: '', component: HomeComponent, children: home_routes}
    // {path: '404', component: E404Component},
    // {path: '**', redirectTo: '/404'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule { }

