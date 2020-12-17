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

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css']
})
export class SummaryViewComponent implements OnInit, OnDestroy {
  unsubscribe: Subject<void> = new Subject();
  @ViewChild('table') table: ColsBasedTableComponent;
  tableConfig = {
    cols: [
        {
            id: 'accepted',
            title: 'Prodotti accettati',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: [
                {label: 'Product Count', value: 'productCount'},
                {label: 'Barcodes', value: (row) => row.products.map(p => p.barcode).join(',')},
            ],
            pagination: true,
            load: (page) => this.getProductsByState(page, 'accepted')
        },
        {
            id: 'to_be_delivered',
            title: 'Da consegnare 1 Passaggio',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: [
                {label: 'Product Count', value: 'productCount'},
                {label: 'Barcodes', value: (row) => row.products.map(p => p.barcode).join(',')},
            ],
            pagination: true,
            load: (page) => this.getProductsByState(page, 'to_be_delivered')
        },
        {
            id: 'to_be_delivered_1',
            title: 'Da consegnare 2 Passaggio',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: [
                {label: 'Product Count', value: 'productCount'},
                {label: 'Barcodes', value: (row) => row.products.map(p => p.barcode).join(',')},
            ],
            pagination: true,
            load: (page) => this.getProductsByState(page, 'to_be_delivered_1')
        },
        {
            id: 'to_be_delivered_2',
            title: 'Da consegnare 3 Passaggio',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: [
                {label: 'Product Count', value: 'productCount'},
                {label: 'Barcodes', value: (row) => row.products.map(p => p.barcode).join(',')},
            ],
            pagination: true,
            load: (page) => this.getProductsByState(page, 'to_be_delivered_2')
        },
        {
            id: 'to_be_delivered_3',
            title: 'Prodooti da rivisionare',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: [
                {label: 'Product Count', value: 'productCount'},
                {label: 'Barcodes', value: (row) => row.products.map(p => p.barcode).join(',')},
            ],
            pagination: true,
            load: (page) => this.getProductsByState(page, 'to_be_delivered_3')
        },
        {
            id: 'not_delivered',
            title: 'Non consegnati',
            text: (row) => `${row.agency.name} - ${row.city.name} - ${row.recipient.name} - ${row.category.name} -
                            ${row.cap.name} - ${row.productCount}`,
            selectable: true,
            expand: [
                {label: 'Product Count', value: 'productCount'},
                {label: 'Barcodes', value: (row) => row.products.map(p => p.barcode).join(',')},
            ],
            pagination: true,
            load: (page) => this.getProductsByState(page, 'not_delivered')
        },
    ],
  };

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
  ) { }

  ngOnInit() {

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

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
