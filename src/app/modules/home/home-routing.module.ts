import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ToDeliverComponent} from './components/to-deliver/to-deliver.component';
import {DeliveringComponent} from './components/delivering/delivering.component';
import {DispatchComponent} from './components/dispatch/dispatch.component';
import {InStockComponent} from './components/in-stock/in-stock.component';
import {NotDeliveredComponent} from './components/not-delivered/not-delivered.component';
import {PreDispatchComponent} from './components/pre-dispatch/pre-dispatch.component';
import {HomeComponent} from './home.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';


const routes: Routes = [
    {path: '', component: HomeComponent, children: [
        {path: '', component: ToDeliverComponent},
        {path: 'delivering', component: DeliveringComponent},
        {path: 'dispatch', component: DispatchComponent},
        {path: 'dispatch/calender', loadChildren: './modules/dispatch-calender/dispatch-calender.module#DispatchCalenderModule'},
        {path: 'delivering/calender', loadChildren: './modules/delivering-calender/delivering-calender.module#DeliveringCalenderModule'},
        {path: 'in-stock', component: InStockComponent},
        {path: 'not-delivered', component: NotDeliveredComponent},
        {path: 'pre-dispatch', component: PreDispatchComponent},
    ]}
];


@NgModule({
    imports: [RouterModule.forChild(routes) , TranslateModule],
    exports: [RouterModule , TranslateModule]
})
export class HomeRoutingModule { }
