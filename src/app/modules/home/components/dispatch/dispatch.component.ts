import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {Subject} from 'rxjs';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {ActionsService} from '../../../../service/actions.service';
import {takeUntil} from 'rxjs/internal/operators';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {DispatchService} from '../../../../service/dispatch.service';
import {FilterConfig} from '../../../../config/filters.config';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})
export class DispatchComponent implements OnInit, OnDestroy {

  dispatchTableConfig = TablesConfig.table.dispatchTable ;
  postmenTableConfig = TablesConfig.simpleTable.postmenTable ;
  actions = [] ;
  unsubscribe: Subject<void> = new Subject();
  subscription: any = false ;
  dispatchList = [] ;
  order_field = null ;
  order_method = '1' ;
  current_postmen = null;

  @ViewChild('dispatchTable') _dispatchTable: TableComponent ;
  postmenGetMethod = (page, rpp, name, order) => this.dispatchService.getAssignedPostmen(page, rpp, name, order);

  constructor(
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private actionsService: ActionsService,
      private dispatchService: DispatchService
  ) { }

  ngOnInit() {
      this.actionsService.setActions(this.actions) ;
      this.filtersService.clear();
      this.filtersService.setFields(FilterConfig.dispatch, this) ;
      this.loadItems(true);
  }

  changePostman(event) {
      this.current_postmen = event;
      this.loadItems(true);
  }

  loadItems(reset) {
      if ( this.subscription ) { this.subscription.unsubscribe(); }
      this.dispatchList = [];
      this._dispatchTable.loading(true);

      if (reset) {
          this.paginationService.updateCurrentPage(1, true);
          this.paginationService.updateLoadingState(true);
          this._dispatchTable.resetSelected();
      }
      this.subscription = this.dispatchService.getDispatches(false, this.current_postmen, this.order_field, this.order_method)
          .pipe(takeUntil(this.unsubscribe)).subscribe((res: ApiResponseInterface) => {
              this.paginationService.updateLoadingState(false);
              // this.paginationService.updateResultsCount(res.pagination.total);
              this.paginationService.updateResultsCount(0);
              this.dispatchService.selectedDispatches = [];
              this.dispatchList = res.data ;
              this._dispatchTable.loading(false);
          });
  }

  changeOrder() {

  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
