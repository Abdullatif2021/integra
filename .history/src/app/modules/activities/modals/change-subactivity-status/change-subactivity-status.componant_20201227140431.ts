import { ModalComponent } from './../../../../shared/modals/modal.component';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationService} from '../../../../service/pagination.service';
import {SnotifyService} from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';
import {FiltersService} from '../../../../service/filters.service';
import {ActivitiesService} from '../../service/activities.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-set-status-modal',
    templateUrl: './change-subactivity-status.componant.html',
    styleUrls: ['./change-subactivity-status.componant.css']
})
export class ChangeSubActivityStatusModalComponent extends ModalComponent implements OnInit, OnDestroy {
    error = 0;
    filtersCount = 0 ; // the total number of applied filters.
    selectedCount = 0; // the total number of selected products.
    filteredProductsCount = 0 ; // the total number of products when a filter is applied.
    confirmed = false ; // the confirmation status, used to check if user had agreed to the warning message.
    unsubscribe: Subject<void> = new Subject(); // used to kill subscriptions.
    stats = [];
    selectedStatus = null ;
    selectedItems = [] ;
    selected = [] ;
    constructor(
        public filtersService: FiltersService,
        public paginationService: PaginationService,
        private modalService: NgbModal,
        private snotifyService: SnotifyService,
        private translate: TranslateService,
        private router: Router,
        private activityservice: ActivitiesService
    ) { super(); }

    ngOnInit() {
      this.selectedItems = this.data.modalData.selected;
      if (typeof this.data.modalData.selected === 'function') {
          this.selectedItems = this.data.modalData.selected();
      }
      this.loadStats();
      this.filtersCount = Object.keys(this.filtersService.filters).length;

      // get selected products count.
      this.selectedCount = this.selectedItems.length;

      // if a street or a city is selected change the filters count.
      // Note that cities and streets filters are treated in a special way in filters service, we'r doing this step because of that.
      if (this.filtersService.specials.cities && !this.filtersService.specials.cities.all) { this.filtersCount++; }
      if (this.filtersService.specials.streets && !this.filtersService.specials.streets.all) { this.filtersCount++; }

      // get total filtered products counts and subscribe to the count changes.
      this.filteredProductsCount = this.paginationService.resultsCount ;
      this.paginationService.resultsCountChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.filteredProductsCount = data;
          }
      );
    }


    run(modal) {
        if (!this.selectedStatus) {
            return this.error = 1;
        }
        const run = {} ;
        if (this.data.method === 'selected') {
            let selected = this.data.modalData.selected;
            if (typeof this.data.modalData.selected === 'function') {
                selected = this.data.modalData.selected();

            }
            this.activityservice.ChangeSubActivityStatus(selected, this.selectedStatus).subscribe(
                data => {
                    if (data.success) {
                        this.snotifyService.success(this.translate.instant('pages.dispatch_view.modals.set_status.success_massege'),
                         { showProgressBar: false, timeout: 2000 });
                    } else {
                        this.snotifyService.error(this.translate.instant('pages.dispatch_view.modals.set_status.wrong_massege'),
                         { showProgressBar: false, timeout: 2000 });
                    }
                }, error => {
                    this.snotifyService.error(this.translate.instant('pages.dispatch_view.modals.set_status.wrong_massege'),
                    { showProgressBar: false, timeout: 2000 });
                }
            );
        }
        
        modal.close();
    }
    loadStats() {
     
          this.stats = ['todo', 'doing', 'done'];  
  }
    confirm() {
        this.confirmed = true ;

    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
