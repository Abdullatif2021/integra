import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {Subject} from 'rxjs';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {ActionsService} from '../../../../service/actions.service';
import {takeUntil} from 'rxjs/internal/operators';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {DispatchService} from '../../../../service/dispatch.service';
import {FilterConfig} from '../../../../config/filters.config';
import {DispatchDeleteComponent} from '../../modals/dispatch-delete/dispatch-delete.component';
import {DispatchActionsService} from '../../service/dispatch-actions.service';
import {DispatchPrepareComponent} from '../../modals/dispatch-prepare/dispatch-prepare.component';
import {CalenderService} from '../../service/calender.service';
import {SnotifyService} from 'ng-snotify';

@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.css']
})
export class DispatchComponent implements OnInit, OnDestroy, AfterViewInit {

    dispatchTableConfig = TablesConfig.table.dispatchTable;
    postmenTableConfig = TablesConfig.simpleTable.postmenTable;
    customPostmenTableConfig = TablesConfig.simpleTable.customPostmenTable;
    simpleDispatchTableConfig = TablesConfig.simpleTable.dispatch;
    reviserTableConfig = TablesConfig.simpleTable.reviserTable;
    unsubscribe: Subject<void> = new Subject();
    subscription: any = false;
    dispatchList = [];
    order_field = null;
    order_method = '1';
    selected_postmen = null;
    selected_dispatches = null;
    viewType: any = 'table';
    _dispatchTable = null;
    _calenderDispatchTable = null;
    subViewType = 'week';

    @ViewChild('dispatchTable') set dispatchTableContent(elemnt: ElementRef) {
        if (elemnt) {
            this._dispatchTable = elemnt;
        }
    }

    @ViewChild('calenderDispatchTable') set calenderDispatchTableContent(elemnt: ElementRef) {
        if (elemnt) {
            this._calenderDispatchTable = elemnt;
        }
    }

    filtersConfig = null;
    actions = [
        {name: 'Prepare', modal: DispatchPrepareComponent},
        {name: 'Elimina', modal: DispatchDeleteComponent},
    ];
    calendar_data = null;

    loadMoreMethods = {
        availablePostmen: (day, page) => this.dispatchService.getCalenderAvailablePostmen(day, page),
    };
    postmenGetMethod = (page, rpp, name, order) => this.dispatchService.getAssignedPostmen(page, rpp, name, order);
    calenderPostmenGetMethod = (page, rpp, name, order) => this.dispatchService.getCalenderWeeklyPostmen(page, rpp, name, order);
    dispatchGetMethod = (page, rpp, name, order) => {
        return this.dispatchService.getCalenderWeeklyDispatches(page, rpp, this.selected_postmen, name, order);
    }
    getSetDetailsMethod = (set) => this.dispatchService.getSetDetails(set);
    availableUsersGetMethod = (set) => this.dispatchService.getAvailableUsers(set);
    constructor(
        private paginationService: PaginationService,
        private filtersService: FiltersService,
        private actionsService: ActionsService,
        private dispatchService: DispatchService,
        private dispatchActionsService: DispatchActionsService,
        private calenderService: CalenderService,
        private snotifyService: SnotifyService,
    ) {
    }

    ngOnInit() {
        this.actionsService.setActions(this.actions);
        this.filtersService.clear();
        this.filtersService.setFields(FilterConfig.dispatch, this);
        this.filtersConfig = <any>Object.assign({}, FilterConfig.dispatch);

        // view change tables / calendar
        this.filtersService.changeViewButtonClicked.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.viewChanged(data);
            }
        );

        this.dispatchActionsService.reloadData.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
            this.loadItems(false);
            this.dispatchService.selectedDispatches = [];
        });

        // subview change week / day
        this.filtersService.changeViewTabsChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.subViewType = data;
                this.filtersService.setFields(this.filtersConfig, this);
            }
        );
    }

    ngAfterViewInit() {
        this.loadItems(true);
    }

    viewChanged(data) {
        this.viewType = data;
        this.filtersConfig.changeViewButton = this.viewType === 'table' ?
            {icon: '/assets/images/calendar.png', value: 'calendar'} :
            {icon: '/assets/images/table.png', value: 'table'};
        this.filtersConfig.changeViewTabs = this.viewType === 'calendar' ? {
            tabs: [
                {text: 'Week', value: 'week', active: this.subViewType === 'week', icon: ['fa', 'calendar-week']},
                {text: 'Day', value: 'day', active: this.subViewType === 'day', icon: ['fa', 'calendar-day']},
            ]
        } : null;
        this.filtersService.setFields(this.filtersConfig, this);
        this.selected_postmen = null;
        this.selected_dispatches = null;
        if (this.viewType === 'table') {
            this.loadItems(true);
        } else if (this.viewType === 'calendar') {
            this.loadCalenderItems();
        }
    }

    changePostman(event) {
        this.selected_postmen = event;
        this.loadItems(true);
    }

    changeCalenderPostman(event) {
        this.selected_postmen = event.items;
        this.selected_dispatches = null;
        if (this._calenderDispatchTable) {
            this._calenderDispatchTable.reload();
        }
        this.loadCalenderItems();
    }

    changeCalenderDispatches(event) {
        this.selected_dispatches = [event.id];
        this.loadCalenderItems();
    }

    loadCalenderItems() {
        this.calendar_data = null;
        this.calenderService.getWeeklyCalender(this.selected_dispatches, this.selected_postmen).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.calendar_data = <any>(data).data;
            }
        );
    }

    loadItems(reset) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.dispatchList = [];
        this._dispatchTable.loading(true);
        if (reset) {
            this.paginationService.updateCurrentPage(1, true);
            this.paginationService.updateLoadingState(true);
            this._dispatchTable.resetSelected();
        }
        this.subscription = this.dispatchService.getDispatches(false, this.selected_postmen, this.order_field, this.order_method)
            .pipe(takeUntil(this.unsubscribe)).subscribe((res: ApiResponseInterface) => {
                this.paginationService.updateLoadingState(false);
                // this.paginationService.updateResultsCount(res.pagination.total);
                this.paginationService.updateResultsCount(0);
                this.dispatchService.selectedDispatches = [];
                this.dispatchList = res.data;
                this._dispatchTable.loading(false);
            });
    }

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

    orderChanged(order) {

    }

    async updateDayAttachment(event) {
        this.dispatchActionsService.uploadDayAttachment(event.day, event.file);
    }

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

    addNoteToSet(event) {
        this.dispatchService.addNoteToSet(event.set, event.note, event.type).subscribe(
            data => {
                this.snotifyService.success('Node Added Successfuly', {showProgressBar: false});
            },
            error => {
                this.snotifyService.error('Something went wrong', {showProgressBar: false});
            }
        );
    }

    selectedItemsChanged(items) {
        this.dispatchService.selectedDispatches = items;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
