import {Component, OnDestroy, OnInit, Input, ComponentFactoryResolver, ViewChild} from '@angular/core';
import {PaginationService} from '../../../../service/pagination.service';
import {takeUntil} from 'rxjs/internal/operators';
import {from, Subject} from 'rxjs';
import {ActionsService} from '../../../../service/actions.service';
import {ActivityDeleteComponent} from '../../modals/activity-delete/activity-delete.component';
import {ChangeSubActivityStatusModalComponent} from '../../modals/change-subactivity-status/change-subactivity-status.componant';
import { TranslateService } from '@ngx-translate/core';
import {FiltersService} from '../../../../service/filters.service';
import {FilterConfig} from '../../../../config/filters.config';
import {Router} from '@angular/router';
import {RecipientsService} from '../../../../service/recipients.service';
import {CustomersService} from '../../../../service/customers.service';
import {AgenciesService} from '../../../../service/agencies.service';
import {CategoriesService} from '../../../../service/categories.service';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';
import {ProductsService} from '../../../../service/products.service';
import {ActivitiesService} from '../../service/activities.service';
import {SnotifyService} from 'ng-snotify';


@Component({
    selector: 'app-list-activities',
    templateUrl: './list-activities.component.html',
    styleUrls: ['./list-activities.component.css']
})
export class ListActivitiesComponent implements OnInit, OnDestroy {

    
    actions = [
        {
            name: this.translate.instant('home.modals.not_delivered_actions.action_name'), fields: [
                { type: 'select', field: 'method', options: [
                        {name: this.translate.instant('home.modals.not_delivered_actions.selected'), value: 'selected'},
                        {name: this.translate.instant('home.modals.not_delivered_actions.by_filter'), value: 'filters'}
                    ], selectedAttribute: {name: 'Selezionati', value: 'selected'}
                }
            ],
            before_modal_open: (event) => this.SelectedCheck(event),
            modal: ChangeSubActivityStatusModalComponent,
            modalData: {
                selected: () => this.activitiesService.getSelectedSubActivities()
                }
                
                
     },
        { name: this.translate.instant('home.activities_action.remove.value'),
        before_modal_open: (event) => this.SelectedCheck(event),
        modal: ActivityDeleteComponent},

    ];
    tableConfig = {
        cols: [
            {title: 'home.modules.activities.tableConfig.name',
                field: 'activityName', value: 'name_value', valueDisplayLabel: 'name'},
            {title: 'home.modules.activities.tableConfig.operator',
                field: 'operator', valueDisplay: 'select', value: 'operator_value', valueDisplayLabel: 'name', multiple: false},
            {title: ['home.modules.activities.tableConfig.start_date', 'home.modules.activities.tableConfig.end_date'],
                field: ['startedAt' , 'endDate'] , separator: true , value_separator: 'dashed' },
            {title: 'home.modules.activities.tableConfig.product', field: 'productsCategories',
                valueDisplay: 'select', value: 'product_value', valueDisplayLabel: 'name', multiple: true},
            {title: ['home.modules.activities.tableConfig.quintity', 'home.modules.activities.tableConfig.quintity_per_day'],
                field: ['productsQty' , 'productsQtyPerDay'] , separator: true , value_separator: 'dashed'},
            {title: 'home.modules.activities.tableConfig.expected_cap',
                field: 'caps', valueDisplay: 'select', value: 'caps_value',
                valueDisplayLabel: 'name', multiple: true},
            {title: 'home.modules.activities.tableConfig.proposed_postman', field: 'postmen', valueDisplay: 'select',
                value: 'postmen_value', valueDisplayLabel: 'full_name', multiple: true},
            {title: 'home.modules.activities.tableConfig.state', field: 'state',
            value: 'state_value', valueDisplayLabel: 'full_name'},
        ],
        theme: 'gray-white',
        selectable: true
    };

    data: any;
    unsubscribe: Subject<void> = new Subject();
    @Input() parent: any ;
    @ViewChild('activitiesTable') _activitiesTable ;
    constructor(
        private paginationService: PaginationService,
        private activitiesService: ActivitiesService,
        public translate: TranslateService,
        private actionsService: ActionsService,
        private snotifyService: SnotifyService,
        private customersService: CustomersService,
        protected recipientsService: RecipientsService,
        private productsService: ProductsService,
        private agenciesService: AgenciesService,
        private filtersService: FiltersService,
        private router: Router,
        protected categoriesService: CategoriesService,
        private translateSelectorService: TranslateSelectorService,
    ) {
        this.translateSelectorService.setDefaultLanuage();
    }

    ngOnInit() {

       
        this.filtersService.setFields(FilterConfig.subactivity, this, 'products');
        this.filtersService.keep('products');
        this.filtersService.clear('products');
        this.actionsService.setActions(this.actions);
        this.paginationService.rppValueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((rpp: number) => {
            this.loadData() ;
        });

        this.paginationService.currentPageChanges.pipe(takeUntil(this.unsubscribe)).subscribe( (page: number) => {
            this.loadData() ;
        });

        this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filtersData: any) => {
            this.handleGroupingDisplay(filtersData.filters);
            this.loadData();
        });

        this.activitiesService.reload.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {this.loadData();}
        );

        this.loadData();
        
    }

    handleGroupingDisplay(filters) {
        if (filters.grouping === 'show_summary') {
            return this.router.navigate(['/summary']);
        }
        if (filters.grouping !== 'show_activities') {
            return this.router.navigate(['/activities']);
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    async loadData() {
        const filledData = [] ;
        this._activitiesTable.loading(true);
        this.activitiesService.getSubActivities().pipe(takeUntil(this.unsubscribe)).subscribe(
            activities => {
               activities.data.forEach(row => {
                    row.startedAt = row.startedAt ? row.startedAt.substr(0, 10).split('/').reverse().join('-') : null;
                    row.doneAt = row.doneAt ? row.doneAt.substr(0, 10).split('/').reverse().join('-') : null;
                    row.postmen_value = row.postmen ? row.postmen.map(p => p.id ) : null;
                    row.product_value = row.productsCategories ? row.productsCategories.map(p => p.id ) : null;
                    row.caps_value = row.caps.map(c => c.id);
                    row.operator_value = row.operator ? row.operator.id : null;
                    row.operator = [row.operator];
                    filledData.push(row);
                });
                this.data = filledData;
                this.paginationService.updateLoadingState(false);
                this.paginationService.updateResultsCount(activities.pagination.total);
                this._activitiesTable.loading(false);
            }, error => {
                this._activitiesTable.loading(false);
            }
        );
    }
    SelectedCheck(event) {
        if (event.method === 'selected' && !this.activitiesService.selectactivities.length) {
            this.snotifyService.warning(this.translate.instant('home.modals.not_delivered_actions.warning.select_first'), { showProgressBar: false, timeout: 2000 });
            return false;
        } else if (event.method === 'filters' && !Object.keys(this.filtersService.getFilterObject(true)).length) {
            this.snotifyService.warning(this.translate.instant('home.modals.not_delivered_actions.warning.no_filter_applied'), { showProgressBar: false, timeout: 2000 });
            return false;
        }
        console.log(event)
        return true;
       
    }
    
    selectedItemsChanged(items) {
        this.activitiesService.selectactivities = items ;
        console.log(items)
    }
}
