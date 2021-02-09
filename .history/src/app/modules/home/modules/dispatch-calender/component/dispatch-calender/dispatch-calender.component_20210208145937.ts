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
import {TranslateService} from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../../../service/translate-selector-service';

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
    @ViewChild('calenderReviserTable') _calenderReviserTable;
    @ViewChild('calender') set postmanCalenderContent(elemnt: ElementRef) {
        if (elemnt) {
            this._calender = elemnt;
        }
    }

    calendar_data = null;
    subViewType = 'week';

    filter_config = {
        search: (container, sp) => [
            {type: 'text', label: this.translate.instant('home.modules.dispatch_calender.name'), key: 'name'},
            {type: 'ng-select', label: this.translate.instant('home.modules.dispatch_calender.agency'),
             key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'text', label: this.translate.instant('home.modules.dispatch_calender.productTypeName'),
             key: 'productTypeName', value: ''},
            {type: 'text', label: this.translate.instant('home.modules.dispatch_calender.recipientName'), key: 'recipientName'}

        ],
        filters: (container, sp) => [
            {type: 'auto-complete', label: this.translate.instant('home.modules.dispatch_calender.client'), key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: this.translate.instant('home.modules.dispatch_calender.filteragency'),
             getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.filtername'), key: 'name'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.dayNote'), key: 'dayNote'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.setNote'), key: 'setNote'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.postmanNote'), key: 'postmanNote'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.postmanDayNote'), key: 'postmanDayNote'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.docName'), key: 'docName'},
            {type: 'ng-select', label: this.translate.instant('home.modules.dispatch_calender.states'), key: 'states', items:  [
                    {name: this.translate.instant('home.modules.dispatch_calender.prepared'), id: 'prepared'},
                ], labelVal: 'name'},
            {type: ['date', 'date'], label: this.translate.instant('home.modules.dispatch_calender.StartDataDistinta'),
             group: true, key: ['startedFrom', 'startedTo']},
            {type: ['date', 'date'], label: this.translate.instant('home.modules.dispatch_calender.DataDistinta'),
             group: true, key: ['createFrom', 'createTo']},
            {type: 'tag', label: this.translate.instant('home.modules.dispatch_calender.barcode'), key: 'barcode'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.actCode'), key: 'actCode', value: ''},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.setCode'), key: 'setCode', value: ''},
            {type: 'ng-select', label: this.translate.instant('home.modules.dispatch_calender.productTypeNameId'),
             key: 'productTypeNameId  ',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: this.translate.instant('home.modules.dispatch_calender.category'),
             key: 'category', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.recipientName2'), key: 'recipientName'},
            {type: 'auto-complete', label:this.translate.instant('home.modules.dispatch_calender.recipientCap'),
             key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: this.translate.instant('home.modules.dispatch_calender.recipientAddress'),
            key: 'recipientAddress'},
        ],
        grouping: false,
        changeViewButton: {icon: '/assets/images/table.png', route: ['/delivering']},
        changeViewTabs: {
            tabs: [
                {text: this.translate.instant('home.modules.dispatch_calender.week'),
                 value: 'week', active: true, icon: ['fa', 'calendar-week']},
                {text: this.translate.instant('home.modules.dispatch_calender.day'),
                 value: 'day', active: false, icon: ['fa', 'calendar-day']},
            ],
            lock: true
        },
    };

    detailsStatuses = [
        {
            id: 'prepared', name: this.translate.instant('home.modules.dispatch_calender.prepared2'),
            handler: async (item) => await this.dispatchActionsService.prepareDispatch(this.translate.instant
                ('home.modules.dispatch_calender.prepareDispatch'),
             [item.id])
        }
    ];

    loadMoreMethods = {
        availablePostmen: (day, page) => this.dispatchService.getCalenderAvailablePostmen(day, page),
        availableRevisore: (day, page) => this.dispatchService.getCalenderAvailablePostmen(day, page, this.translate.instant
                ('home.modules.dispatch_calender.revisore')),
    };

    actions = [ { name: this.translate.instant('home.activities_action.remove.value'), modal: ActivityDeleteComponent }];

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
                page, rpp, name, order, this.calender_current_week, 'NOT_PREAPERED', this.loadDate, this.translate.instant
                ('home.modules.dispatch_calender.revisore')
        ) :
        this.dispatchService.getCalenderDailyPostmen(
            page, rpp, name, order, this.calender_current_day, 'NOT_PREAPERED', this.loadDate, this.translate.instant
                ('home.modules.dispatch_calender.revisore')
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
    addNoteToSet = (note, type, set, file = null) => {
        const result = this.dispatchService.addNoteToSet(set, note, type, file).toPromise().catch(e => {});
        if (result) {
            this.snotifyService.success(this.translate.instant
                ('home.modules.dispatch_calender.addNoteToSet.success'), {showProgressBar: false});
        } else {
            this.snotifyService.error(this.translate.instant
                ('home.modules.dispatch_calender.addNoteToSet.error'), {showProgressBar: false});
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
        private translate: TranslateService,
        private translateSelectorService: TranslateSelectorService,

        ) {
          this.translateSelectorService.setDefaultLanuage();
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
            this._calenderReviserTable.reload();
        });
    }

    async doTheFirstLoad() {
        this.filter_config.changeViewTabs.lock = true ;
        this.loadDate = this.route.snapshot.queryParams.date;
        const data = await <any>this.calenderService.getWeeklyCalender(
            this.calender_current_week,
            this.selected_dispatches,
            this.selected_postmen,
            this.selectect_revisor,
            this.route.snapshot.queryParams.date
        ).toPromise().catch(e => {});
        if (!data) {
            return this.snotifyService.error(this.translate.instant
                ('home.modules.dispatch_calender.assignToUser.error'), {showProgressBar: false});
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
                    this._calenderDispatchTable.reload();
                    this._calenderPostmenTable.reload();
                    this._calenderReviserTable.reload();
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
            this._calenderReviserTable.reload();
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
        this._calenderReviserTable.reload();
        this.loadCalenderItems();
    }

    changeCalenderDay(event) {
        this.calender_current_day = event.date;
        if (event.reload) {
            this._calenderDispatchTable.reload();
            this._calenderPostmenTable.reload();
            this._calenderReviserTable.reload();
        }
        this.updateRouteParams();
    }

    // assign dispatch to user. <calender view>
    assignSetToUser(event) {
        this.dispatchService.assignToUser(event.sets, event.user).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.snotifyService.success(this.translate.instant
                    ('home.modules.dispatch_calender.assignToUser.success'), {showProgressBar: false});
            },
            error => {
                this.snotifyService.error(this.translate.instant
                    ('home.modules.dispatch_calender.assignToUser.error'), {showProgressBar: false});
            }
        );
    }

    // when the user changes the day attachment. <calender view>
    async updateDayAttachment(event) {
        const result = await this.dispatchActionsService.uploadDayAttachment(event.day, event.file);
        event.dayObj.file = {path: result.data.file, name: result.data.original_file_name};
    }

    // when the user changes the day note. <calender view>
    updateDayNote(event) {
        this.dispatchService.updateDayNote(event.day, event.note).subscribe(
            data => {
                this.snotifyService.success(this.translate.instant
                    ('home.modules.dispatch_calender.updateDayNote.success'), {showProgressBar: false});
            },
            error => {
                this.snotifyService.error(this.translate.instant
                    ('home.modules.dispatch_calender.updateDayNote.error'), {showProgressBar: false});
            }
        );
    }

    // when the user changes postman note. <calender view>
    updatePostmanDayNote(event) {
        this.dispatchService.updatePostmanDayNote(event.postman, event.day, event.note).subscribe(
            data => {
                this.snotifyService.success(this.translate.instant
                    ('home.modules.dispatch_calender.updatePostmanDayNote.success'), {showProgressBar: false});
            },
            error => {
                this.snotifyService.error(this.translate.instant
                    ('home.modules.dispatch_calender.updatePostmanDayNote.error'), {showProgressBar: false});
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
                this._calenderReviserTable.reload();
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
