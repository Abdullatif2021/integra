import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationService} from '../../../../../../service/pagination.service';
import {takeUntil} from 'rxjs/internal/operators';
import {ActivitiesService} from '../../service/activities.service';
import {Subject} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  tableConfig = {
      cols: [
          {title: this.translate.instant('home.modules.activities.tableConfig.operator'),
           field: 'users_list', valueDisplay: 'select', value: 'user', valueDisplayLabel: 'name', },
          {title: this.translate.instant('home.modules.activities.tableConfig.start_date'), field: 'startedAt', valueDisplay: 'dateSelect'},
          {title: this.translate.instant('home.modules.activities.tableConfig.end_date'), field: 'startedAt', valueDisplay: 'dateSelect'},
          {title: this.translate.instant('home.modules.activities.tableConfig.product'),
           field: 'productsCategories', valueDisplay: 'select', value: 'productValue', valueDisplayLabel: 'name'},
          {title: this.translate.instant('home.modules.activities.tableConfig.quintity_per_day'),
           field: 'qty', valueDisplay: 'singleSelect'},
          {title: this.translate.instant('home.modules.activities.tableConfig.expected_cap'),
           field: 'cap', valueDisplay: 'select', value: 'capValue', valueDisplayLabel: 'name'},
          {title: this.translate.instant('home.modules.activities.tableConfig.proposed_postman'),
           field: 'postmen_list', valueDisplay: 'select', value: 'postmen', valueDisplayLabel: 'full_name'},
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
  ) {
      translate.setDefaultLang('itly');
    }

  ngOnInit() {
      this.paginationService.rppValueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((rpp: number) => {
          this.loadData() ;
      });
      this.paginationService.currentPageChanges.pipe(takeUntil(this.unsubscribe)).subscribe( (page: number) => {
          this.loadData() ;
      });
      this.loadData();
  }
  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
  async loadData() {
      const data = <any> await this.activitiesService.getFilledActivities().catch(e => { console.error(e); });
      if (!data) { return ; }
      this.data = data.data;
      this.paginationService.updateLoadingState(false);
      this.paginationService.updateResultsCount(data.pagination.total);
  }


}
