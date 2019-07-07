import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagesComponent} from './pages.component';
import {PreDispatchProductsComponent} from './components/pre-dispatch-products/pre-dispatch-products.component';

const routes: Routes = [
    {path: '', component: PagesComponent, children: [
            {path: 'pre-dispatch/:id/products', component: PreDispatchProductsComponent},
        ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
