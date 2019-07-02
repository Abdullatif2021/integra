import {Component, OnInit, ViewChild} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';

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


  constructor(
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private preDispatchService: PreDispatchService
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
      this.filtersService.clear();
      this.loadItems(true);
  }

}
