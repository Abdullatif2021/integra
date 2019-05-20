import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCogs,faChevronDown,faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component'
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { ToDeliverPage } from './pages/to-deliver/to-deliver.page';
import {TablesModule} from '../modules/tables/tables.module';
import { PreDispatchPage } from './pages/pre-dispatch/pre-dispatch.page';
import { DispatchPage } from './pages/dispatch/dispatch.page';
import { DeliveringPage } from './pages/delivering/delivering.page';
import { InStockPage } from './pages/in-stock/in-stock.page';
import { NotDeliveredPage } from './pages/not-delivered/not-delivered.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    TablesModule,
    RouterModule
  ],
  declarations: [
      UserNavComponent,
      MainNavComponent,
      SearchPanelComponent,
      ToDeliverPage,
      PreDispatchPage,
      DispatchPage,
      DeliveringPage,
      InStockPage,
      NotDeliveredPage
  ],
  exports: [
    UserNavComponent,
    MainNavComponent,
    SearchPanelComponent
  ]
})
export class CoreModule {
    constructor(){
        library.add(faCogs);
        library.add(faBell);
        library.add(faChevronDown);
        library.add(faChevronUp);
    }
}
