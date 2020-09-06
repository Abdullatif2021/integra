import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagesComponent} from './pages.component';
import {PreDispatchProductsComponent} from './components/pre-dispatch-products/pre-dispatch-products.component';
import {PreDispatchLogComponent} from './components/pre-dispatch-log/pre-dispatch-log.component';
import {DispatchLogComponent} from './components/dispatch-log/dispatch-log.component';

const routes: Routes = [
    {path: '', component: PagesComponent, children: [
            {path: 'pre-dispatch/:id/products', component: PreDispatchProductsComponent},
            {path: 'pre-dispatch/:id/log', component: PreDispatchLogComponent},
            {path: 'dispatch/:id/log', component: DispatchLogComponent},
        ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
