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
  subViewType = 'week';
  @ViewChild('dispatchTable') set content(elemnt: ElementRef) {
      if ( elemnt ) {
          this._dispatchTable = elemnt;
      }
  }
  filtersConfig = null ;

  // DUMMY DATA {
  calendar_data = {
      date: '10 - 16 agosto 2020',
      days: [
          {
              note: 'Some note',
              number: 10,
              date: '31 Marzo 2020',
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
              number: 11,
              attachment: 'something.docx',
              date: '1 Aprile 2020',
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
              number: 12,
              note: 'Some note',
              attachment: 'something.docx',
              date: '2 Aprile 2020',
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
                  date: '3 Aprile 2020',
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
              number: 13,
              note: 'Some note',
              attachment: 'something.docx',
              date: '4 Aprile 2020',
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
              number: 14,
              note: 'Some note',
              attachment: 'something.docx',
              date: '5 Aprile 2020',
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
              number: 15,
              attachment: 'something.docx',
              date: '6 Aprile 2020',
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
              number: 16,
              attachment: 'something.docx',
              date: '7 Aprile 2020',
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
      this.filtersConfig = <any>Object.assign({}, FilterConfig.dispatch);

      // view change tables / calendar
      this.filtersService.changeViewButtonClicked.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.viewType = data;
              this.filtersConfig.changeViewButton = this.viewType === 'table' ?
                  {icon: '/assets/images/calendar.png', value: 'calendar'} :
                  {icon: '/assets/images/table.png', value: 'table'} ;
              this.filtersConfig.changeViewTabs = this.viewType === 'calendar' ? {
                  tabs: [
                      {text: 'Week', value: 'week', active: this.subViewType === 'week', icon: ['fa', 'calendar-week']},
                      {text: 'Day', value: 'day', active: this.subViewType === 'day', icon: ['fa', 'calendar-day']},
                  ]
              } : null ;
              console.log(this.filtersConfig);
              this.filtersService.setFields(this.filtersConfig, this) ;
              if (this.viewType === 'table') {
                  this.loadItems(true);
              }
          }
      );

      // subview change week / day
      this.filtersService.changeViewTabsChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.subViewType = data;
              this.filtersService.setFields(this.filtersConfig, this) ;
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
