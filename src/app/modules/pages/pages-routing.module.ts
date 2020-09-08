import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagesComponent} from './pages.component';

const routes: Routes = [
    {path: '', component: PagesComponent, children: [
        {
            path: 'pre-dispatch/:id/products',
            loadChildren: './modules/pre-dispatch-products/pre-dispatch-products.module#PreDispatchProductsModule'
        },
        {
            path: 'pre-dispatch/:id/log',
            loadChildren: './modules/pre-dispatch-log/pre-dispatch-log.module#PreDispatchLogModule'
        },
        {
            path: 'dispatch/:id/log',
            loadChildren: './modules/dispatch-log/dispatch-log.module#DispatchLogModule'
        },
        {
            path: 'dispatch/view/:id',
            loadChildren: './modules/dispatch-view/dispatch-view.module#DispatchViewModule'
        },
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
