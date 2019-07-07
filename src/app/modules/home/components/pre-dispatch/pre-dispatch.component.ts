import {Component, OnInit, ViewChild} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchMergeComponent} from '../../modals/pre-dispatch-merge/pre-dispatch-merge.component';
import {IntegraaModalService} from '../../../../service/integraa-modal.service';

@Component({
  selector: 'app-pre-dispatch',
  templateUrl: './pre-dispatch.component.html',
  styleUrls: ['./pre-dispatch.component.css']
})
export class PreDispatchComponent implements OnInit {

  table = TablesConfig.table.preDispatchTable ;
  subscription: any = false ;
  preDispatchList: any = [] ;
  @ViewChild('preDispatchTable') _preDispatchTable: TableComponent ;
  @ViewChild('imodal') imodal ;
  actions = [{name: 'Unisci Pre-distinte', modal: PreDispatchMergeComponent}] ;

  constructor(
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private preDispatchService: PreDispatchService,
      private actionsService: ActionsService,
      private integraaModalService: IntegraaModalService
  ) { }

    // Dummy data {
  loadItems(reset: boolean) {
      if ( this.subscription ) { this.subscription.unsubscribe(); }
      this.preDispatchList = [];
      this._preDispatchTable.loading(true);
      if (reset) {
          this.paginationService.updateCurrentPage(1, true);
          this.paginationService.updateLoadingState(true);
          this._preDispatchTable.resetSelected();
      }
      this.subscription = this.preDispatchService.getPreDispatchItems().subscribe((res: ApiResponseInterface) => {
          this.paginationService.updateLoadingState(false);
          this.paginationService.updateResultsCount(res.pagination.total);
          this.preDispatchList = res.data ;
          this._preDispatchTable.loading(false);
      });
  }
  // } Dummy data


  ngOnInit() {
      this.actionsService.setActions(this.actions) ;
      this.filtersService.clear();
      this.loadItems(true);
      this.actionsService.reloadData.subscribe((state) => {
          this.loadItems(false) ;
          this.preDispatchService.selectedPreDispatches = [] ;
      });
      // setTimeout(() => {this.integraaModalService.open('/settings', {width: '400px', height: '300px'}) ; }, 1000);
      // setTimeout(() => {this.integraaModalService.open('/dispatch', {width: '400px', height: '300px'}) ; }, 3000);
  }

  selectedItemsChanged(items) {
      this.preDispatchService.selectedPreDispatches = items ;
  }
}
