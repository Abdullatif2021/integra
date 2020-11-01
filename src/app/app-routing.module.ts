import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntegraaPreloadingStrategy} from './core/strategy/integraa-preloading.strategy';
import {GoogleScriptResolver} from './shared/resolver/google-script.resolver';

const routes: Routes = [
    {path: '', loadChildren: './modules/home/home.module#HomeModule'},
    {path: 'settings', loadChildren: './modules/settings/settings.module#SettingsModule'},
    {path: 'pages', loadChildren: './modules/pages/pages.module#PagesModule'},
    {path: 'schedule/:id', loadChildren: './modules/schedule/schedule.module#ScheduleModule',
        data: { preload: '/pre-dispatch' }, resolve: {map: GoogleScriptResolver}},
    // {path: '404', component: E404Component},
    // {path: '**', redirectTo: '/404'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: IntegraaPreloadingStrategy})],
    // imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule { }

