import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {IntegraaPreloadingStrategy} from './core/strategy/integraa-preloading.strategy';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
const routes: Routes = [
    {path: '', loadChildren: './modules/home/home.module#HomeModule'},
    {path: 'settings', loadChildren: './modules/settings/settings.module#SettingsModule'},
    {path: 'pages', loadChildren: './modules/pages/pages.module#PagesModule'},
    {path: 'schedule/:id', loadChildren: './modules/schedule/schedule.module#ScheduleModule', data: { preload: '/pre-dispatch' }},
    // {path: '404', component: E404Component},
    // {path: '**', redirectTo: '/404'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: IntegraaPreloadingStrategy}), TranslateModule],
    // imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule, TranslateModule]
})


export class AppRoutingModule { }

