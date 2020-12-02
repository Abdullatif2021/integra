import { TranslateService } from '@ngx-translate/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {takeUntil} from 'rxjs/internal/operators';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {Subject} from 'rxjs';
import {DispatchService} from '../../../../service/dispatch.service';
import {SnotifyService} from 'ng-snotify';
import {DispatchActionsService} from '../../service/dispatch-actions.service';

@Component({
    selector: 'app-dispatch-assign',
    templateUrl: './dispatch-assign.component.html',
    styleUrls: ['./dispatch-assign.component.css']
})
export class DispatchAssignComponent extends ModalComponent implements OnInit, OnDestroy {

    filtersCount = 0;
    filteredProductsCount = 0;
    items;
    unsubscribe: Subject<void> = new Subject();
    users = [] ;
    selected = null ;
    error = null ;
    confirmed = false;

    constructor(
        private filtersService: FiltersService,
        private paginationService: PaginationService,
        private dispatchService: DispatchService,
        private snotifyService: SnotifyService,
        private dispatchActionsService: DispatchActionsService,
        private translate: TranslateService,

    ) {
        super();
      }

    ngOnInit() {
        this.items = this.dispatchService.selectedDispatches;
        this.dispatchService.getAvailableUsers().subscribe(
            data => {
                this.users = data.data ;
            }
        )
        this.filtersCount = Object.keys(this.filtersService.filters).length;

        // if a street or a city is selected change the filters count.
        // Note that cities and streets filters are treated in a special way in filters service, we'r doing this step because of that.
        if (this.filtersService.specials.postmen && !this.filtersService.specials.postmen.all) {
            this.filtersCount++;
        }
        // get total filtered products counts and subscribe to the count changes.
        this.filteredProductsCount = this.paginationService.resultsCount;
        this.paginationService.resultsCountChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.filteredProductsCount = data;
            }
        );
    }

    selectChanged(event) {
        if (event) { this.error = null ; }
        this.selected = event;
    }

    run(modal) {
        if (!this.selected) {
            return this.error = 1;
        }
        this.dispatchActionsService.assignToUser(this.data.method, this.selected.id, this.items ? this.items.map(item => item.id) : null);
        modal.close();
    }


    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
