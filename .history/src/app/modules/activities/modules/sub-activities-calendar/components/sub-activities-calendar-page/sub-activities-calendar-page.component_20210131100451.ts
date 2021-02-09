import { TranslateService } from '@ngx-translate/core';
import { FiltersService } from '../../../../../../service/filters.service';
import { ActionsService } from '../../../../../../service/actions.service';
import { ActivitiesService } from '../../../../service/activities.service';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TablesConfig} from '../../../../../../config/tables.config';
import {SubActivitiesCalendarService} from '../../service/sub-activities-calendar.service';
import { takeUntil, map } from 'rxjs/internal/operators';
import {Observable, Subject} from 'rxjs';
import {FilterConfig} from '../../../../../../config/filters.config';
import {PaginationService} from '../../../../../../service/pagination.service';
import {RecipientsService} from '../../../../../../service/recipients.service';
import {AgenciesService} from '../../../../../../service/agencies.service';
import {CustomersService} from '../../../../../../service/customers.service';

@Component({
  selector: 'app-sub-activities-calendar-page',
  templateUrl: './sub-activities-calendar-page.component.html',
  styleUrls: ['./sub-activities-calendar-page.component.css']
})
export class SubActivitiesCalendarPageComponent implements OnInit, OnDestroy {
  unsubscribe: Subject<void> = new Subject();
  selected_Activity = null;
  loadDataSubscription;
  actions = [];
  activityTableConfig = TablesConfig.simpleTable.activity;
  config = {
      // icon: '/assets/images/subb.png',
      text: 'activityName',
      group_name: 'state'
  };
  @ViewChild('activity') _activityTable ;
  @ViewChild('timeBasedCalendar') _timeBasedCalendar ;
  data = [];
  baseDate = 0;
  calender_current_week = 0;
  filter_config = {
      search: (container, sp) => [
          {type: 'text', label: 'filter_config.subactivity.search.sub_name', key: 'customerName'},
          {type: 'text', label: 'filter_config.subactivity.search.operator', key: 'dispatchCode'},
          {type: 'date', label: 'filter_config.subactivity.search.start_date', key: 'startDate'},
          {type: 'date', label: 'filter_config.subactivity.search.end_date', key: 'endDate'},
          {type: 'text', label: 'filter_config.subactivity.search.product', key: 'recipientName'},
          {type: 'text', label: 'filter_config.subactivity.search.quintity', key: 'actCode'},
          {type: 'text', label: 'filter_config.subactivity.search.quintity_per_day', key: 'recipientName'},
          {type: 'text', label: 'filter_config.subactivity.search.expected_cap', key: 'articleLawName'},
          {type: 'text', label: 'filter_config.subactivity.search.proposed_postman', key: 'articleLawDate'},
          {type: 'ng-select', label: 'filter_config.subactivity.filter.select_value', labelVal: 'name', key: 'state',
          items: [
              {name: 'filter_config.products.filter.activity.todo', id: 'todo'},
              {name: 'filter_config.products.filter.activity.doing', id: 'doing'},
              {name: 'filter_config.products.filter.activity.done', id: 'done'}]
          , unclearbale: true,
          selectedAttribute: {name: 'filter_config.products.filter.activity.todo', id: 'null'}}
      ],

      filters: (container, sp) => [
          {type: 'simpleText', label: 'filter_config.subactivity.filter.sub_name', key: 'name'},
          {type: 'auto-complete', label: 'filter_config.products.filter.client', key: 'customerId',
              getMethod: (term) => container.customersService.getCustomersByName(term),
              items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
          {type: 'auto-complete', label: 'filter_config.products.filter.agency',
          getMethod: (term) => container.agenciesService.getAgenciesByName(term),
              key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
          {type: 'simpleText', label: 'filter_config.subactivity.filter.operator', key: 'user'},
          {type: 'simpleText', label: 'filter_config.products.search.bar_code', key: 'barcode'},
          {type: 'simpleText', label: 'filter_config.products.search.act_code', key: 'actCode'},
          {type: 'ng-select', label: 'filter_config.products.filter.product', key: 'productTypeNameId',
          items: sp.filters_data.products_type, labelVal: 'type'},
          {type: 'simpleText', label: 'filter_config.products.filter.recipient_name', key: 'recipientName', value: ''},
          {type: 'auto-complete', label: 'filter_config.products.filter.address', key: 'recipientId', labelVal: 'name',
              getMethod: (term) => container.recipientsService.getRecipientsByName(term),
              items: sp.filters_data.recipient, _class: 'auto-complete'},
          {type: 'auto-complete', label: 'filter_config.products.filter.recipient_postal_code',
           key: 'code', items: sp.filters_data.caps_group,
              labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
          {type: 'date', label: 'filter_config.subactivity.search.start_date', key: 'startDate'},
          {type: 'date', label: 'filter_config.subactivity.search.end_date', key: 'endDate'},
          {type: 'simpleText', label: 'filter_config.products.filter.destination', key: 'destination'},
          {type: 'simpleText', label: 'filter_config.subactivity.filter.quintity', key: 'totalQuantity'},
          {type: 'number', label: 'filter_config.subactivity.filter.quintity_per_day', key: 'qtyPerDay'},
          {type: 'simpleText', label: 'filter_config.subactivity.filter.proposed_postman', key: ''},
          {type: 'ng-select', label: 'filter_config.subactivity.filter.select_value', labelVal: 'name', key: 'state',
          items: [
              {name: 'filter_config.subactivity.filter.todo', id: 'todo'},
              {name: 'filter_config.subactivity.filter.doing', id: 'doing'},
              {name: 'filter_config.subactivity.filter.done', id: 'done'}]
          , unclearbale: true,
          selectedAttribute: {name: 'filter_config.products.filter.activity.todo', id: 'null'}},

      ],
    grouping: false,
    changeViewButton: {icon: '/assets/images/table.png', route: ['/activities']},
  };


  activityGetMethod = () => this.activitiesService.getActivities(this.calender_current_week);

  constructor(
    private subActivitiesCalendarService: SubActivitiesCalendarService,
    private activitiesService: ActivitiesService,
    private actionsService: ActionsService,
    private paginationService: PaginationService,
    private filtersService: FiltersService,
    private translate: TranslateService,
    public recipientsService: RecipientsService,
    public agenciesService: AgenciesService,
    public customersService: CustomersService
     ) { }

  ngOnInit() {
    this.filtersService.setFields(this.filter_config, this, 'products');
    this.filtersService.keep('products');
    this.filtersService.clear('products');
    this.actionsService.setActions(this.actions);
    this.paginationService.updateResultsCount(-1);
    this.paginationService.updateLoadingState(false)
    this.loadData();
    this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filtersData: any) => {
        this.subActivitiesCalendarService.selected_Activity = null ;
        this.loadData();
        this._activityTable.reload();
    });
  }

  loadData() {
    if (this.loadDataSubscription) {
        this.loadDataSubscription.unsubscribe();
    }
    this._timeBasedCalendar.setLoadingSate(true);
    this.loadDataSubscription = this.subActivitiesCalendarService.getSubActivityCalender(
        this.calender_current_week,
        this.subActivitiesCalendarService.getSelectedActivity()
    ).pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
          this._timeBasedCalendar.setLoadingSate(false);
          this.data = data.data.data;
          this.baseDate = data.data.baseDate.split('/').reverse().join('-');
      });
  }

  changeCalenderWeekIndex(event) {
    this.calender_current_week = event;
    this.loadData();
    this._activityTable.reload();
  }

  changeActivity(event) {
      this.selected_Activity = event;
      this.subActivitiesCalendarService.selected_Activity = this.selected_Activity;
      this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
