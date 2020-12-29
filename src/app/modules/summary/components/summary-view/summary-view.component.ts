import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SummaryService} from '../../services/summary.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {FiltersService} from '../../../../service/filters.service';
import {FilterConfig} from '../../../../config/filters.config';
import {Router} from '@angular/router';
import {ColsBasedTableComponent} from '../../../../shared/components/cols-based-table/cols-based-table.component';
import {PaginationService} from '../../../../service/pagination.service';
import {CustomersService} from '../../../../service/customers.service';
import {AgenciesService} from '../../../../service/agencies.service';
import {RecipientsService} from '../../../../service/recipients.service';
import {CategoriesService} from '../../../../service/categories.service';
import {CreateNewActivityComponent} from '../../../../parts/activities-part/modals/create-new-activity/create-new-activity.component';
import {TranslateService} from '@ngx-translate/core';
import {ActionsService} from '../../../../service/actions.service';
import {SnotifyService} from 'ng-snotify';
import {ProductsService} from '../../../../service/products.service';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css']
})
export class SummaryViewComponent implements OnInit, OnDestroy {
  unsubscribe: Subject<void> = new Subject();
  selectedItems = [] ;
  @ViewChild('table') table: ColsBasedTableComponent;
  tableConfig = {
    cols: [
        {
            id: 'accepted',
            title: 'Prodotti accettati',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: {
                items: 'products',
                display: (product) => product.barcode,
                selectable: true,
                loadMoreMethod: async (row, page, col) => {
                    const data = await this.summaryService.getProductsByGroupInfo(row, page).toPromise();
                    if (data.statusCode === 200) {
                        return data.data ;
                    } else {
                        console.log('error');
                        return [] ;
                    }
                }
            },
            pagination: true,
            itemId: (item) => `${item.city.id}-${item.cap.id}-${item.category.id}-${item.recipient.id}-${item.agency.id}`,
            load: (page) => this.getProductsByState(page, 'accepted')
        },
        {
            id: 'to_be_delivered',
            title: 'Da consegnare 1 Passaggio',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: {
                items: 'products',
                display: (product) => product.barcode,
                selectable: true,
                loadMoreMethod: async (row, page, col) => {
                    const data = await this.summaryService.getProductsByGroupInfo(row, page).toPromise();
                    if (data.statusCode === 200) {
                        return data.data ;
                    } else {
                        console.log('error');
                        return [] ;
                    }
                }
            },
            pagination: true,
            itemId: (item) => `${item.city.id}-${item.cap.id}-${item.category.id}-${item.recipient.id}-${item.agency.id}`,
            load: (page) => this.getProductsByState(page, 'to_be_delivered')
        },
        {
            id: 'to_be_delivered_1',
            title: 'Da consegnare 2 Passaggio',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: {
                items: 'products',
                display: (product) => product.barcode,
                selectable: true,
                loadMoreMethod: async (row, page, col) => {
                    const data = await this.summaryService.getProductsByGroupInfo(row, page).toPromise();
                    if (data.statusCode === 200) {
                        return data.data ;
                    } else {
                        console.log('error');
                        return [] ;
                    }
                }
            },
            pagination: true,
            itemId: (item) => `${item.city.id}-${item.cap.id}-${item.category.id}-${item.recipient.id}-${item.agency.id}`,
            load: (page) => this.getProductsByState(page, 'to_be_delivered_1')
        },
        {
            id: 'to_be_delivered_2',
            title: 'Da consegnare 3 Passaggio',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: {
                items: 'products',
                display: (product) => product.barcode,
                selectable: true,
                loadMoreMethod: async (row, page, col) => {
                    const data = await this.summaryService.getProductsByGroupInfo(row, page).toPromise();
                    if (data.statusCode === 200) {
                        return data.data ;
                    } else {
                        console.log('error');
                        return [] ;
                    }
                }
            },
            pagination: true,
            itemId: (item) => `${item.city.id}-${item.cap.id}-${item.category.id}-${item.recipient.id}-${item.agency.id}`,
            load: (page) => this.getProductsByState(page, 'to_be_delivered_2')
        },
        {
            id: 'to_be_delivered_3',
            title: 'Prodooti da rivisionare',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: {
                items: 'products',
                display: (product) => product.barcode,
                selectable: true,
                loadMoreMethod: async (row, page, col) => {
                    const data = await this.summaryService.getProductsByGroupInfo(row, page).toPromise();
                    if (data.statusCode === 200) {
                        return data.data ;
                    } else {
                        console.log('error');
                        return [] ;
                    }
                }
            },
            pagination: true,
            itemId: (item) => `${item.city.id}-${item.cap.id}-${item.category.id}-${item.recipient.id}-${item.agency.id}`,
            load: (page) => this.getProductsByState(page, 'to_be_delivered_3')
        },
        {
            id: 'not_delivered',
            title: 'Non consegnati',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: {
                items: 'products',
                display: (product) => product.barcode,
                selectable: true,
                loadMoreMethod: async (row, page, col) => {
                    const data = await this.summaryService.getProductsByGroupInfo(row, page).toPromise();
                    if (data.statusCode === 200) {
                        return data.data ;
                    } else {
                        console.log('error');
                        return [] ;
                    }
                }
            },
            pagination: true,
            load: (page) => this.getProductsByState(page, 'not_delivered')
        },
    ],
  };

  actions = [
      {
          name: this.translate.instant('home.to_delivered_action.create_one.value'), fields: [
              { type: 'select', field: 'method', options: [
                      {name: this.translate.instant('home.to_delivered_action.create_one.select'), value: 'selected'},
                      {name: this.translate.instant('home.to_delivered_action.create_one.by_filter'), value: 'filters'}
                  ], selectedAttribute: {name: this.translate.instant('home.to_delivered_action.create_one.select'), value: 'selected'}
              }
          ],
          before_modal_open: (event) => this.createActivityCheck(event),
          modal: CreateNewActivityComponent,
          modalOptions: {size: 'xl'}
      },
  ]

  data = null ;

  constructor(
      private summaryService: SummaryService,
      private filtersService: FiltersService,
      private router: Router,
      private paginationService: PaginationService,
      protected recipientsService: RecipientsService,
      private customersService: CustomersService,
      private agenciesService: AgenciesService,
      protected categoriesService: CategoriesService,
      private translate: TranslateService,
      private actionsService: ActionsService,
      private snotifyService: SnotifyService,
      private productsService: ProductsService
  ) { }

  ngOnInit() {
      this.actionsService.setActions(this.actions);
      const filtersConfig = <any>{...FilterConfig.products};
      filtersConfig.default_filters = {
          'grouping': 'show_summary'
      };
      this.filtersService.setFields(filtersConfig, this, 'products');
      this.filtersService.keep('products');
      this.filtersService.clear('products');

      this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filtersData: any) => {
          this.handleGroupingDisplay(filtersData.filters);
          this.table.reload();
      });
      this.paginationService.updateResultsCount(-1);
      this.paginationService.updateLoadingState(false);
      this.paginationService.updateCurrentPage(-1);
  }

  handleGroupingDisplay(filters) {
      if (filters.grouping === 'show_activities') {
          return this.router.navigate(['activities']);
      }
      if (filters.grouping !== 'show_summary') {
          return this.router.navigate(['/']);
      }
  }

  getProductsByState(page, state) {
      return new Promise((resolve, reject) => {
         this.summaryService.getProductsByState(page, state).pipe(takeUntil(this.unsubscribe)).subscribe(
             data => {
                 resolve(data);
             },
             error => {
                 reject(error);
             }
         );
      });
  }

  selectedItemsUpdated(event) {
     this.selectedItems = event ;
     this.productsService.selectedProducts = this.getGroupedSelectedItems();
     this.productsService.selectState = 'groups' ;
  }

  createActivityCheck(event) {
      if (event.method === 'selected' && (!this.selectedItems || !this.selectedItems.length)) {
          this.snotifyService.warning('You have to select products first', { showProgressBar: false, timeout: 2000 });
          return false;
      } else if (event.method === 'filters' && !Object.keys(this.filtersService.getFilterObject(true)).length) {
          this.snotifyService.warning('No Filters applied', { showProgressBar: false, timeout: 2000 });
          return false;
      }
      return true;
  }

  getGroupedSelectedItems() {
      let product_ids = [] ;
      const groups = [] ;
      this.selectedItems.forEach(item => {
          if (item.selected && item.selected.length) {
              product_ids = product_ids.concat(item.selected);
          } else {
              groups.push({
                  city: item.item.city.id,
                  cap: item.item.cap.id,
                  category: item.item.category.id,
                  customer: item.item.recipient.id,
                  agency: item.item.agency.id,
              });
              if (item.except) {
                  groups[groups.length - 1].without = item.except ;
              }
          }
      });
      return {
          product_ids: product_ids,
          groups: groups
      };
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
