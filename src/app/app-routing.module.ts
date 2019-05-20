import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ToDeliverPage} from './core/pages/to-deliver/to-deliver.page';
import {DeliveringPage} from './core/pages/delivering/delivering.page';
import {DispatchPage} from './core/pages/dispatch/dispatch.page';
import {InStockPage} from './core/pages/in-stock/in-stock.page';
import {NotDeliveredPage} from './core/pages/not-delivered/not-delivered.page';
import {PreDispatchPage} from './core/pages/pre-dispatch/pre-dispatch.page';


const routes: Routes = [
    {path: '', component: ToDeliverPage},
    {path: 'delivering', component: DeliveringPage},
    {path: 'dispatch', component: DispatchPage},
    {path: 'in-stock', component: InStockPage},
    {path: 'not-delivered', component: NotDeliveredPage},
    {path: 'pre-dispatch', component: PreDispatchPage},
    // {path: '404', component: E404Component},
    // {path: '**', redirectTo: '/404'}

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})


export class AppRoutingModule { }

