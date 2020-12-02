import { TranslateSelectorService } from './../../service/translate-selector-service';
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
import {PreDispatchActionsService} from './service/pre-dispatch-actions.service';
import {DispatchActionsService} from './service/dispatch-actions.service';
import {DispatchDeleteComponent} from './modals/dispatch-delete/dispatch-delete.component';
import { DispatchPrepareComponent } from './modals/dispatch-prepare/dispatch-prepare.component';
import {CalenderService} from './service/calender.service';
import { DispatchAssignComponent } from './modals/dispatch-assign/dispatch-assign.component';
import { FormsModule } from '@angular/forms';
import {ProductStatusService} from '../../service/product-status.service';
import {NotDeliveredService} from '../../service/not-delivered.service';
import { CreateNewActivityComponent } from './modals/create-new-activity/create-new-activity.component';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule,
    NgSelectModule,
    FontAwesomeModule,
    FormsModule,
    TranslateModule.forChild()
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
      DispatchDeleteComponent,
      DispatchPrepareComponent,
      DispatchAssignComponent,
      CreateNewActivityComponent,
  ],
  exports: [
      HomeComponent,
      HomeRoutingModule,
  ],
  bootstrap: [HomeComponent],
  providers: [
      PreDispatchActionsService,
      DispatchActionsService,
      CalenderService,
      ProductStatusService,
      NotDeliveredService,
  ],
  entryComponents: [
      PreDispatchAddComponent,
      PreDispatchAddDirectComponent,
      PreDispatchNewComponent,
      PreDispatchMergeComponent,
      ImportFromBarcodesComponent,
      PreDispatchEditComponent,
      PreDispatchDeleteComponent,
      PwsisbsConfirmModalComponent,
      PsbatpdwsiConfirmModalComponent,
      DispatchDeleteComponent,
      DispatchPrepareComponent,
      DispatchAssignComponent,
      CreateNewActivityComponent
  ],

})
export class HomeModule {
    constructor() {
        library.add(faCaretLeft);
        library.add(faCaretRight);
        library.add(faTrash);
    }
}
