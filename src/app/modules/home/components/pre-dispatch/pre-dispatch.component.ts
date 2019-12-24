import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchMergeComponent} from '../../modals/pre-dispatch-merge/pre-dispatch-merge.component';
import {IntegraaModalService} from '../../../../service/integraa-modal.service';
import {FilterConfig} from '../../../../config/filters.config';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirective} from '../../../../shared/directives/modal.directive';
import {PreDispatchDeleteComponent} from '../../modals/pre-dispatch-delete/pre-dispatch-delete.component';
import {Router} from '@angular/router';
import {BackProcessingService} from '../../../../service/back-processing.service';

@Component({
  selector: 'app-pre-dispatch',
  templateUrl: './pre-dispatch.component.html',
  styleUrls: ['./pre-dispatch.component.css']
})
export class PreDispatchComponent implements OnInit, OnDestroy {

  table = TablesConfig.table.preDispatchTable ;
  subscription: any = false ;
  preDispatchList: any = [] ;
  @ViewChild('preDispatchTable') _preDispatchTable: TableComponent ;
  @ViewChild('imodal') imodal ;
  @ViewChild(ModalDirective) modalHost: ModalDirective;
  actions = [
      {name: 'Unisci Pre-distinte', modal: PreDispatchMergeComponent},
      {name: 'Elimina', modal: PreDispatchDeleteComponent, modalOptions: {}},
  ] ;
  unsubscribe: Subject<void> = new Subject();

  constructor(
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private preDispatchService: PreDispatchService,
      private actionsService: ActionsService,
      private integraaModalService: IntegraaModalService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private modalService: NgbModal,
      public router: Router,
      public backProcessingService: BackProcessingService
  ) { }

  loadItems(reset: boolean) {
      if ( this.subscription ) { this.subscription.unsubscribe(); }
      this.preDispatchList = [];
      this._preDispatchTable.loading(true);

      if (reset) {
          this.paginationService.updateCurrentPage(1, true);
          this.paginationService.updateLoadingState(true);
          this._preDispatchTable.resetSelected();
      }
      this.subscription = this.preDispatchService.getPreDispatchItems().pipe(takeUntil(this.unsubscribe))
          .subscribe((res: ApiResponseInterface) => {
          this.paginationService.updateLoadingState(false);
          this.paginationService.updateResultsCount(res.pagination.total);
          this.preDispatchService.selectedPreDispatches = [];
          this.preDispatchList = res.data ;
          this._preDispatchTable.loading(false);
      });
  }


  ngOnInit() {
      this.actionsService.setActions(this.actions) ;
      this.filtersService.clear();
      this.loadItems(true);
      this.actionsService.reloadData.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
          this.loadItems(false) ;
          this.preDispatchService.selectedPreDispatches = [] ;
      });
      this.filtersService.setFields(FilterConfig.pre_dispatch, this) ;
      this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filters) => {
          this.loadItems(true) ;
      });
  }
  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
  selectedItemsChanged(items) {
      this.preDispatchService.selectedPreDispatches = items ;
  }

  openModal(modal, data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(modal);
      const viewContainerRef = this.modalHost.viewContainerRef ;
      viewContainerRef.clear() ;
      const componentRef = viewContainerRef.createComponent(componentFactory);
      const instance = <any>componentRef.instance ;
      instance.data = data  ;
      this.modalService.open(instance.modalRef, { windowClass: 'animated slideInDown' }) ;
  }
}
