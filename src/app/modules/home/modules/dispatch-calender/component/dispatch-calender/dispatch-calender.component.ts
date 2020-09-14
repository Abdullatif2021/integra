import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {CalenderService} from '../../../../../home/service/calender.service';
import {SnotifyService} from 'ng-snotify';
import {TablesConfig} from '../../../../../../config/tables.config';
import {DispatchService} from '../../../../../../service/dispatch.service';
import {FiltersService} from '../../../../../../service/filters.service';
import {Subject} from 'rxjs';
import {DispatchActionsService} from '../../../../service/dispatch-actions.service';
import {ActionsService} from '../../../../../../service/actions.service';
import {PaginationService} from '../../../../../../service/pagination.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriesService} from '../../../../../../service/categories.service';
import {AgenciesService} from '../../../../../../service/agencies.service';
import {RecipientsService} from '../../../../../../service/recipients.service';
import {CustomersService} from '../../../../../../service/customers.service';

@Component({
    selector: 'app-dispatch-calender',
    templateUrl: './dispatch-calender.component.html',
    styleUrls: ['./dispatch-calender.component.css']
})
export class DispatchCalenderComponent implements OnInit, OnDestroy {

    customPostmenTableConfig = TablesConfig.simpleTable.customPostmenTable;
    simpleDispatchTableConfig = TablesConfig.simpleTable.dispatch;
    reviserTableConfig = TablesConfig.simpleTable.reviserTable;
    unsubscribe: Subject<void> = new Subject();

    selected_postmen = null;
    selectect_revisor = null ;
    selected_dispatches = null;
    loadDate = null ;
    calender_current_week = 0;
    calender_current_day = null ;
    _calender ;
    // the dispatches table component, presented in calender view.
    @ViewChild('calenderDispatchTable') _calenderDispatchTable;
    @ViewChild('calenderPostmenTable') _calenderPostmenTable;
    @ViewChild('calender') set postmanCalenderContent(elemnt: ElementRef) {
        if (elemnt) {
            this._calender = elemnt;
        }
    }

    calendar_data = null;
    subViewType = 'week';

    filter_config = {
        search: (container, sp) => [
            {type: 'text    ', label: 'Nominativo Distinta', key: 'name'},
            {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'text', label: 'Nome Prodotto:', key: 'productTypeName', value: ''},
            {type: 'text', label: 'Nominativo Destinatario', key: 'recipientName'},

        ],
        filters: (container, sp) => [
            {type: 'auto-complete', label: 'Cliente', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'Agenzia', getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Distinta', key: 'name'},
            {type: 'simpleText', label: 'Nota giorno', key: 'dayNote'},
            {type: 'simpleText', label: 'Note Per La Distinta', key: 'setNote'},
            {type: 'simpleText', label: 'Nome allegato', key: 'docName'},
            {type: 'simpleText', label: 'Note Per Il Postion', key: 'postmanNote'},
            {type: 'ng-select', label: 'Stato Distinta ', key: 'states', items:  [
                    {name: 'Not Assigned', id: 'no_assigned'},
                    {name: 'Not Prepare', id: 'not_prepare'},
                    {name: 'Prepared', id: 'prepared'},
                ], labelVal: 'name'},
            {type: ['date', 'date'], label: 'Start Data Distinta:', group: true, key: ['startedFrom', 'startedTo']},
            {type: ['date', 'date'], label: 'Data Distinta:', group: true, key: ['createFrom', 'createTo']},
            {type: 'tag', label: 'Codice Barre', key: 'barcode'},
            {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'Set Code', key: 'setCode', value: ''},
            {type: 'ng-select', label: 'Prodotto', key: 'productTypeNameId  ',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'Categoria', key: 'category', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName'},
            {type: 'auto-complete', label: 'CAP Destinatario:', key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'recipientAddress'},
        ],
        grouping: false,
        changeViewButton: {icon: '/assets/images/table.png', route: ['/dispatch']},
        changeViewTabs: {
            tabs: [
                {text: 'Week', value: 'week', active: true, icon: ['fa', 'calendar-week']},
                {text: 'Day', value: 'day', active: false, icon: ['fa', 'calendar-day']},
            ],
            lock: true
        },
    };

    detailsStatuses = [
        {
          id: 'prepared', name: 'Borsa Pronta alla consegna',
          handler: async (item) => await this.dispatchActionsService.prepareDispatch('selected', [item.id])
        }
    ];

    loadMoreMethods = {
        availablePostmen: (day, page) => this.dispatchService.getCalenderAvailablePostmen(day, page),
        availableRevisore: (day, page) => this.dispatchService.getCalenderAvailablePostmen(day, page, 'revisore'),
    };

    actions = [];

    // Calender Methods {
    calenderPostmenGetMethod = (page, rpp, name, order) => {
        return this.subViewType === 'week' ?
            this.dispatchService.getCalenderWeeklyPostmen(
                page, rpp, name, order, this.calender_current_week, 'NOT_PREAPERED', this.loadDate
        ) :
        this.dispatchService.getCalenderDailyPostmen(
            page, rpp, name, order, this.calender_current_day, 'NOT_PREAPERED', this.loadDate
        );
    }

    calenderRevisorGetMethod = (page, rpp, name, order) => {
        return this.subViewType === 'week' ?
            this.dispatchService.getCalenderWeeklyPostmen(
                page, rpp, name, order, this.calender_current_week, 'NOT_PREAPERED', this.loadDate, 'revisore'
        ) :
        this.dispatchService.getCalenderDailyPostmen(
            page, rpp, name, order, this.calender_current_day, 'NOT_PREAPERED', this.loadDate, 'revisore'
        );
    }

    dispatchGetMethod = (page, rpp, name, order) => {
        return this.subViewType === 'week' ?
            this.dispatchService.getCalenderWeeklyDispatches(
                page, rpp, this.selected_postmen, this.selectect_revisor, name, order,
                this.calender_current_week, 'NOT_PREAPERED', this.loadDate
            ) :
            this.dispatchService.getCalenderDailyDispatches(
                page, rpp, this.selected_postmen, this.selectect_revisor, name, order,
                this.calender_current_day, 'NOT_PREAPERED', this.loadDate
            );
    }

    getSetDetailsMethod = (set) => this.dispatchService.getSetDetails(set);
    availableUsersGetMethod = (set) => this.dispatchService.getAvailableUsers();
    // when the user writes a comment on a set. <calender view>
    addNoteToSet = (note, type, set) => {
        const result = this.dispatchService.addNoteToSet(set, note, type).toPromise().catch(e => {});
        if (result) {
            this.snotifyService.success('Node Added Successfuly', {showProgressBar: false});
        } else {
            this.snotifyService.error('Something went wrong', {showProgressBar: false});
        }
        return result ;
    }
    // } Calender Methods

    constructor(
        private filtersService: FiltersService,
        private calenderService: CalenderService,
        private snotifyService: SnotifyService,
        private dispatchService: DispatchService,
        private dispatchActionsService: DispatchActionsService,
        private actionsService: ActionsService,
        private paginationService: PaginationService,
        private route: ActivatedRoute,
        private router: Router,
        private categoriesService: CategoriesService,
        protected customersService: CustomersService,
        protected agenciesService: AgenciesService,
        protected recipientsService: RecipientsService,
    ) {
    }

    ngOnInit() {
        this.actionsService.setActions(this.actions);
        this.filtersService.clear();
        this.filtersService.setFields(this.filter_config, this);
        // subview change week / day
        this.filtersService.changeViewTabsChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.selected_dispatches = [];
                this.subViewChanged(data);
            }
        );
        this.doTheFirstLoad();
        this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filters) => {
            this.loadCalenderItems(true);
            this._calenderDispatchTable.reload();
            this._calenderPostmenTable.reload();
        });
    }

    async doTheFirstLoad() {
        this.filter_config.changeViewTabs.lock = true ;
        this.loadDate = this.route.snapshot.queryParams.date;
        const data = await <any>this.calenderService.getWeeklyCalender(
            this.calender_current_week,
            this.selected_dispatches,
            this.selected_postmen,
            this.route.snapshot.queryParams.date
        ).toPromise().catch(e => {});
        if (!data) {
            return this.snotifyService.error('Something went wrong', {showProgressBar: false});
        }
        this.filter_config.changeViewTabs.lock = false ;
        this.calendar_data = <any>(data).data;
        if (data.data.length) { this.calender_current_day = data.data[0].dayDate; }
        this.paginationService.updateLoadingState(false);
        this.paginationService.updateCurrentPage(-1);
        this.paginationService.updateResultsCount(-1);
        setTimeout(() => {
            if (this.route.snapshot.queryParams.day) {
                this.calender_current_day = this.calendar_data[parseInt(this.route.snapshot.queryParams.day, 10)].dayDate;
                this._calender.current_day = parseInt(this.route.snapshot.queryParams.day, 10);
            }
            if (this.route.snapshot.queryParams.locate_day) {
                this.calender_current_day = this.route.snapshot.queryParams.date;
                const first_day = new Date(this.calendar_data[0].dayDate.split('/').reverse().join('-'));
                const dispatch_day = new Date(this.route.snapshot.queryParams.date);
                const diff: number = Math.abs(first_day.getTime() - dispatch_day.getTime())  / (1000 * 60 * 60 * 24);
                this._calender.current_day = diff;
            }
            if (this.route.snapshot.queryParams.dispatch) {
                this._calender.displayedPostman(parseInt(this.route.snapshot.queryParams.dispatch, 10), null, false);
            }
            if (this.route.snapshot.queryParams.view) {
                this.subViewType = this.route.snapshot.queryParams.view;
                this.filter_config.changeViewTabs.tabs.map(tab => tab.value === this.subViewType ? tab.active = true : tab.active = false);
                if (this.subViewType === 'day') {
                    console.log(this.calender_current_day);
                    this._calenderDispatchTable.reload();
                    this._calenderPostmenTable.reload();
                }
            }
        });
    }

    // when the sub view is changed week/day.
    subViewChanged(data, day = null, dispatch = null) {
        // in case change happened from inner component
        this.filter_config.changeViewTabs.tabs.map(tab => tab.value === data ? tab.active = true : tab.active = false);
        if (dispatch) { this._calender.displayedPostman(dispatch, null, false); }
        if (day) {
            this._calender.setDay(day.substr(0, 10));
            this.calender_current_day = day.substr(0, 10);
        }
        if (!(data === 'day' && this.subViewType === 'day')) {
            this.subViewType = data;
            this._calenderDispatchTable.reload(dispatch ? true : false);
            this._calenderPostmenTable.reload();
        } else { this.subViewType = data; }
        this.updateRouteParams();
    }

    updateRouteParams() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                view: this.subViewType,
                day: this._calender.current_day,
                dispatch: this._calender.displayed_postman,
                date: this.calendar_data ? this.calendar_data[0].dayDate.split('/').reverse().join('-') : ''
            },
            queryParamsHandling: 'merge',
        });
    }

    // when the user select postmen to filter. <calender view>
    changeCalenderPostman(event) {
        this.selected_postmen = event.items;
        this.selected_dispatches = null;
        if (this._calenderDispatchTable) {
            this._calenderDispatchTable.reload();
        }
        this.loadCalenderItems();
    }
    // when the user select postmen to filter. <calender view>
    changeRevisorPostman(event) {
        this.selectect_revisor = event.items;
        this.selected_dispatches = null;
        if (this._calenderDispatchTable) {
            this._calenderDispatchTable.reload();
        }
        this.loadCalenderItems();
    }

    // when the user select a dispatch to filter. <calender view>
    changeCalenderDispatches(event) {
        if (!event) {
            this._calender.displayedPostman(null);
            return this.updateRouteParams();
        }
        this.selected_dispatches = [event.id];
        this.subViewChanged('day', event.started_at, event.id);
    }

    // when the user changes the displayed week. <calender view>
    changeCalenderWeekIndex(event) {
        this.calender_current_week = event;
        this._calenderDispatchTable.reload();
        this._calenderPostmenTable.reload();
        this.loadCalenderItems();
    }

    changeCalenderDay(event) {
        this.calender_current_day = event.date;
        if (event.reload) {
            this._calenderDispatchTable.reload();
            this._calenderPostmenTable.reload();
        }
        this.updateRouteParams();
    }

    // assign dispatch to user. <calender view>
    assignSetToUser(event) {
        this.dispatchService.assignToUser(event.sets, event.user).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.snotifyService.success('Set Assigned Successfully', {showProgressBar: false});
            },
            error => {
                this.snotifyService.error('Something went wrong', {showProgressBar: false});
            }
        );
    }

    // when the user changes the day attachment. <calender view>
    async updateDayAttachment(event) {
        this.dispatchActionsService.uploadDayAttachment(event.day, event.file);
    }

    // when the user changes the day note. <calender view>
    updateDayNote(event) {
        this.dispatchService.updateDayNote(event.day, event.note).subscribe(
            data => {
                this.snotifyService.success('Note Updated Successfuly', {showProgressBar: false});
            },
            error => {
                this.snotifyService.error('Something went wrong', {showProgressBar: false});
            }
        );
    }

    // when the user changes postman note. <calender view>
    updatePostmanDayNote(event) {
        this.dispatchService.updatePostmanDayNote(event.postman, event.day, event.note).subscribe(
            data => {
                this.snotifyService.success('Postman Note Updated Successfuly', {showProgressBar: false});
            },
            error => {
                this.snotifyService.error('Something went wrong', {showProgressBar: false});
            }
        );
    }

    postmanDisplayed(data) {
        if (data) {
            this._calenderDispatchTable.forceSelect({id: data.postman});
            this.calender_current_day = data.day;
            if (this.subViewType !== 'day') {
                this.subViewType = 'day';
                this.filter_config.changeViewTabs.tabs.map(tab => tab.value === 'day' ? tab.active = true : tab.active = false);
                this._calenderDispatchTable.reload(true);
                this._calenderPostmenTable.reload();
            }
        } else {
            this._calenderDispatchTable.forceSelect(null);
        }
        this.updateRouteParams();
    }
    // loads weekly calender data
    loadCalenderItems(keep_day = false) {
        if (keep_day) {
            this._calender.save_day_index = this._calender.current_day;
        }
        this.calendar_data = null;
        this.filter_config.changeViewTabs.lock = true ;
        this.calenderService.getWeeklyCalender(
            this.calender_current_week,
            this.selected_dispatches,
            this.selected_postmen,
            this.selectect_revisor,
            this.loadDate,
        ).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.filter_config.changeViewTabs.lock = false ;
                this.calendar_data = <any>(data).data;
                if (data.data.length && !keep_day) {
                    this.calender_current_day = data.data[0].dayDate;
                }
                this.paginationService.updateLoadingState(false);
                this.paginationService.updateCurrentPage(-1);
                this.paginationService.updateResultsCount(-1);
                this.updateRouteParams();
            }
        );
    }

    getCategoriesByName(name) {
        return this.categoriesService.getCategoriesByName(name);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
