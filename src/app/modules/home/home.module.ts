import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDeliverComponent } from './components/to-deliver/to-deliver.component';
import { PreDispatchComponent } from './components/pre-dispatch/pre-dispatch.component';
import { DispatchComponent } from './components/dispatch/dispatch.component';
import { DeliveringComponent } from './components/delivering/delivering.component';
import { InStockComponent } from './components/in-stock/in-stock.component';
import { NotDeliveredComponent } from './components/not-delivered/not-delivered.component';
import { HomeComponent } from './home.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { PreDispatchAddComponent } from './modals/pre-dispatch-add/pre-dispatch-add.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PreDispatchNewComponent } from './modals/pre-dispatch-new/pre-dispatch-new.component';
import { PreDispatchMergeComponent } from './modals/pre-dispatch-merge/pre-dispatch-merge.component';
import { ImportFromBarcodesComponent } from './modals/import-from-barcodes/import-from-barcodes.component';
import { PreDispatchEditComponent } from './modals/pre-dispatch-edit/pre-dispatch-edit.component';
import { PreDispatchDeleteComponent } from './modals/pre-dispatch-delete/pre-dispatch-delete.component';
import { PreDispatchAddDirectComponent } from './modals/pre-dispatch-add-direct/pre-dispatch-add-direct.component';
import { PwsisbsConfirmModalComponent } from './modals/pwsisbs-confirm-modal/pwsisbs-confirm-modal.component';
import { PsbatpdwsiConfirmModalComponent } from './modals/psbatpdwsi-confirm-modal/psbatpdwsi-confirm-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCaretLeft,
    faCaretRight
} from '@fortawesome/free-solid-svg-icons';
import {faBackward} from '@fortawesome/free-solid-svg-icons/faBackward';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule,
    NgSelectModule,
    FontAwesomeModule
  ],
  declarations: [
      ToDeliverComponent,
      PreDispatchComponent,
      DispatchComponent,
      DeliveringComponent,
      InStockComponent,
      NotDeliveredComponent,
      HomeComponent,
      PreDispatchAddComponent,
      PreDispatchNewComponent,
      PreDispatchMergeComponent,
      ImportFromBarcodesComponent,
      PreDispatchEditComponent,
      PreDispatchDeleteComponent,
      PreDispatchAddDirectComponent,
      PwsisbsConfirmModalComponent,
      PsbatpdwsiConfirmModalComponent,
  ],
  exports: [
      HomeComponent,
      HomeRoutingModule,
  ],
  bootstrap: [HomeComponent],
  entryComponents: [
      PreDispatchAddComponent,
      PreDispatchAddDirectComponent,
      PreDispatchNewComponent,
      PreDispatchMergeComponent,
      ImportFromBarcodesComponent,
      PreDispatchEditComponent,
      PreDispatchDeleteComponent,
      PwsisbsConfirmModalComponent,
      PsbatpdwsiConfirmModalComponent
  ],

})
export class HomeModule {
    constructor() {
        library.add(faCaretLeft);
        library.add(faCaretRight);
    }
}
