import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', loadChildren: './modules/home/home.module#HomeModule'},
    {path: 'settings', loadChildren: './modules/settings/settings.module#SettingsModule'},
    {path: 'pages', loadChildren: './modules/pages/pages.module#PagesModule'},
    {path: 'schedule/:id', loadChildren: './modules/schedule/schedule.module#ScheduleModule'},
    // {path: '404', component: E404Component},
    // {path: '**', redirectTo: '/404'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule { }

