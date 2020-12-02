import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationService} from '../../../../../../service/pagination.service';
import {takeUntil} from 'rxjs/internal/operators';
import {ActivitiesService} from '../../service/activities.service';
import {Subject} from 'rxjs';
import { OwnTranslateService } from '../../../../../../service/translate.service';
import { TranslateService } from '@ngx-translate/core';
import {FiltersService} from '../../../../../../service/filters.service';
import {FilterConfig} from '../../../../../../config/filters.config';
import {Router} from '@angular/router';
import {RecipientsService} from '../../../../../../service/recipients.service';
import {CustomersService} from '../../../../../../service/customers.service';
import {AgenciesService} from '../../../../../../service/agencies.service';
import {CategoriesService} from '../../../../../../service/categories.service';
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  tableConfig = {
      cols: [
          {title: this.translate.instant('home.modules.activities.tableConfig.operator'), field: 'operator', valueDisplay: 'select', value: 'operator_value',
              valueDisplayLabel: 'name', multiple: false},
          {title: this.translate.instant('home.modules.activities.tableConfig.start_date'), field: 'startedAt', valueDisplay: 'dateSelect'},
          {title: this.translate.instant('home.modules.activities.tableConfig.end_date'), field: 'startedAt', valueDisplay: 'dateSelect'},
          {title: this.translate.instant('home.modules.activities.tableConfig.product'), field: 'productsCategories', valueDisplay: 'select', value: 'product_value',
              valueDisplayLabel: 'name', multiple: true},
          {title: this.translate.instant('home.modules.activities.tableConfig.quintity_per_day'), field: 'productsQty', valueDisplay: 'singleSelect'},
          {title: this.translate.instant('home.modules.activities.tableConfig.expected_cap'), field: 'caps', valueDisplay: 'select', value: 'caps_value',
              valueDisplayLabel: 'name', multiple: true},
          {title: this.translate.instant('home.modules.activities.tableConfig.proposed_postman'), field: 'postmen', valueDisplay: 'select',
              value: 'postmen_value', valueDisplayLabel: 'full_name', multiple: true},
      ],
      theme: 'gray-white',
      selectable: false
  };

  data: any;
  unsubscribe: Subject<void> = new Subject();

  constructor(
      private paginationService: PaginationService,
      private activitiesService: ActivitiesService,
      public translate: TranslateService,
      protected recipientsService: RecipientsService,
      private customersService: CustomersService,
      private agenciesService: AgenciesService,
      private filtersService: FiltersService,
      private router: Router,
      protected categoriesService: CategoriesService,
  ) {
      translate.setDefaultLang('itly');
      const browserLang = translate.getBrowserLang();
    }

  ngOnInit() {
      this.filtersService.setFields(FilterConfig.products, this, 'products');
      this.filtersService.keep('products');
      this.filtersService.clear('products');
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
      this.loadData();
  }

  handleGroupingDisplay(filters) {
      if (filters.grouping !== 'show_activities') {
          return this.router.navigate(['/']);
      }
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

  async loadData() {
      const filledData = [] ;
      this.activitiesService.getSubActivities().pipe(takeUntil(this.unsubscribe)).subscribe(
          activities => {
              console.log(activities);
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
              console.log(this.data);
              this.paginationService.updateLoadingState(false);
              this.paginationService.updateResultsCount(activities.pagination.total);
          }, error => {

          }
      );
  }


}
