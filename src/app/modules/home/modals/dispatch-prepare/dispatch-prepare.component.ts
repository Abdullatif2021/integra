import { TranslateService } from '@ngx-translate/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {DispatchActionsService} from '../../service/dispatch-actions.service';
import {DispatchService} from '../../../../service/dispatch.service';
import {takeUntil} from 'rxjs/internal/operators';
import {FiltersService} from '../../../../service/filters.service';
import {PaginationService} from '../../../../service/pagination.service';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-dispatch-prepare',
    templateUrl: './dispatch-prepare.component.html',
    styleUrls: ['./dispatch-prepare.component.css']
})
export class DispatchPrepareComponent extends ModalComponent implements OnInit, OnDestroy {

    items = [];
    confirmed = false ;
    data: any ;
    filtersCount = 0;
    filteredProductsCount = 0 ;
    unsubscribe: Subject<void> = new Subject();

    constructor(
        private dispatchService: DispatchService,
        private dispatchActionsService: DispatchActionsService,
        private filtersService: FiltersService,
        private paginationService: PaginationService,
        private translate: TranslateService,
    ) {
        super();
        translate.setDefaultLang('itly');
        const browserLang = translate.getBrowserLang();
    }

    ngOnInit() {
        this.items = this.dispatchService.selectedDispatches;
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

    async run(modal) {
        modal.close();
        await this.dispatchActionsService.prepareDispatch(this.data.method, this.items ? this.items.map(item => item.id) : null);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
