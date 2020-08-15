import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class DispatchComponent implements OnInit, OnDestroy, AfterViewInit {

  dispatchTableConfig = TablesConfig.table.dispatchTable ;
  postmenTableConfig = TablesConfig.simpleTable.postmenTable ;
  customPostmenTableConfig = TablesConfig.simpleTable.customPostmenTable ;
  simpleDispatchTableConfig = TablesConfig.simpleTable.dispatch ;
  reviserTableConfig = TablesConfig.simpleTable.reviserTable;
  actions = [] ;
  unsubscribe: Subject<void> = new Subject();
  subscription: any = false ;
  dispatchList = [] ;
  order_field = null ;
  order_method = '1' ;
  current_postmen = null;
  viewType: any = 'table';
  _dispatchTable = null ;
  @ViewChild('dispatchTable') set content(elemnt: ElementRef) {
      if ( elemnt ) {
          this._dispatchTable = elemnt;
      }
  }

  // DUMMY DATA {
  calendar_data = {
      date: '16 - 23 agosto 2020',
      days: [
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: 'Nota nota nota nota nota nota nota'},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
          {
              note: 'Some note',
              attachment: 'something.docx',
              revisers: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
              postmen: {
                  occupied: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                  ],
                  available: [
                      {name: 'Postino 1', note: ''},
                      {name: 'Postino 2', note: ''},
                      {name: 'Postino 3', note: ''},
                      {name: 'Postino 3', note: ''},
                  ]
              },
          },
      ]
  };
  // } DUMMY DATA

  postmenGetMethod = (page, rpp, name, order) => this.dispatchService.getAssignedPostmen(page, rpp, name, order);
  // todo change this
  dispatchGetMethod = (page, rpp, name, order) => this.dispatchService.getDispatches(false, this.current_postmen, order, order);
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
      this.filtersService.changeViewButtonClicked.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.viewType = data;
              const filtersConfig = Object.assign({}, FilterConfig.dispatch);
              filtersConfig.changeViewButton = this.viewType === 'table' ?
                  {icon: '/assets/images/calendar.png', value: 'calendar'} :
                  {icon: '/assets/images/table.png', value: 'table'} ;
              this.filtersService.setFields(filtersConfig, this) ;
              console.log(this.viewType);
              if (this.viewType === 'table') {
                  this.loadItems(true);
              }
          }
      );
  }

  ngAfterViewInit() {
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

  changeOrder(order) {

  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
