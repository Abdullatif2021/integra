import {Component, OnInit, Input, Output, ViewChild, ChangeDetectorRef, AfterViewChecked, EventEmitter} from '@angular/core';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {PaginationService} from '../../../service/pagination.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewChecked {

    constructor(
        private cdr: ChangeDetectorRef,
        private paginationService: PaginationService
    ) { }

    cells_size = [] ;
    @ViewChild('tableRow') tableRowElement;
    @Input() table: object = {} ;
    @Input() items: any = [] ;
    @Input() page = 1 ;
    @Input() rpp = 25 ;
    @Input() getMethod ;

    pagination: any = { total: 0, totalProduct: 0 };
    loaded = false ;
    loading = true ;
    subscription: any = false ;

    ngOnInit() {
        // TODO change this thing location to the actual page, don't forget the loading data event emitting, use output instead
        this.loadData(false);
        this.paginationService.rppValueChanges.subscribe((rpp: number) => {
            this.rpp = rpp ;
            this.loadData(false) ;
        });
        this.paginationService.currentPageChanges.subscribe( (page: number) => {
            this.page = page ;
            this.loadData(false) ;
        });
        this.page = this.paginationService.currentPage ;
        this.rpp = this.paginationService.rpp ;
    }

    loadData(append) {
        if (typeof this.getMethod !== 'function') { return ; }
        // this.paginationService.updateLoadingState(true);
        if (!append) {
            this.items = [] ;
        }

        this.loading = true ;
        if ( this.subscription ) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.getMethod(this.page, this.rpp).subscribe((res: ApiResponseInterface) => {
            if (res.status === 'success') {
                if (append) {
                    this.items = this.items.concat(res.data);
                } else { this.items = res.data ; }
                this.pagination = res.pagination ;
                this.paginationService.updateLoadingState(false);
                this.paginationService.updateResultsCount(this.pagination.tolal);
                this.loaded = true ;
                this.loading = false ;
            }
        });
    }

    typeof(variable) {
        return typeof variable ;
    }

    getFieldClass(col, field) {
        if (typeof col.classes !== 'undefined') {
            return col.classes[field] ? col.classes[field] : '';
        }
        return '' ;
    }

    ngAfterViewChecked() {
        this.updateTableHeaderSize();
    }

    updateTableHeaderSize() {
        if (!this.tableRowElement) { return ; }
        const items = this.tableRowElement.nativeElement.getElementsByTagName('td') ;
        this.cells_size = [] ;
        for (let i = 0 ; i < items.length ; ++i) {
            this.cells_size.push(items[i].clientWidth);
        }
        this.cdr.detectChanges();
    }

    getCellWidth(idx) {
        return this.cells_size[idx] + 'px';
    }


}

