import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    AfterViewChecked,
    EventEmitter,
    Output,
    SimpleChanges, OnChanges, OnDestroy
} from '@angular/core';
import { TranslateService , TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {

    constructor(private cdr: ChangeDetectorRef , private translate: TranslateService)
    {
      translate.setDefaultLang('itly');
    }

    cells_size = [] ;
    @ViewChild('tableRow') tableRowElement;
    @Input() table: any = {} ;
    @Input() items: any = [] ;
    @Input() klass = '' ;
    @Input() parent: any ;
    isLoading = true ;
    @Output() selected = new EventEmitter() ;
    @Output() orderChange = new EventEmitter() ;
    currentOrder = {field: 'id', order: 'DESC'};
    selectedProducts = [] ;
    isCollapsed = {} ;
    itemsProgressSubscriptions = {} ;
    itemsProgressWarning = {} ;
    selectable = true;
    // the refresh counter, used to check if there is a need to reset selected items.
    @Input() refresh: number ;

    ngOnInit() {
        if (this.items && this.items.length) { this.loading(false); }
    }

    loading(state) {
        this.isLoading = state ;
    }

    typeof(variable) {
        return typeof variable ;
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

    isSelectedRow(item) {
        return this.selectedProducts.find((elm) => elm.id === item.id ) ;
    }

    selectItem(item) {
        if (!this.selectable) { return ; }
        if (this.selectedProducts.find((elm) => elm.id === item.id  ) !== undefined) {
            this.selectedProducts = this.selectedProducts.filter((elm) => {
                return item.id !== elm.id ;
            });
        } else {
            this.selectedProducts.push(item) ;
        }
        this.selected.emit(this.selectedProducts);
    }

    selectAll() {
        if (!this.selectable) { return; }
        if (this.selectedProducts && this.selectedProducts.length) {
            this.selectedProducts = [] ;
        } else {
            this.selectedProducts = this.items ;
        }
        this.selected.emit(this.selectedProducts);
    }

    resetSelected() {
        this.selectedProducts = [] ;
        this.selected.emit(this.selectedProducts);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            if (this.items && this.items.length) {
                this.loading(false);
            }
        }
        if (changes.items && !changes.refresh) {
            this.selectedProducts = [];
        }
        if (changes.table) {
            this.selectable = typeof this.table.selectable !== 'undefined' ? this.table.selectable : true ;
        }
    }

    trackItems(item) {
        return item.id ;
    }

    changeOrder(field, order) {
        this.currentOrder = {field: field, order: order} ;
        this.selectedProducts = [];
        this.selected.emit(this.selectedProducts);
        this.orderChange.emit(this.currentOrder);
    }

    ngOnDestroy() {
        Object.values(this.itemsProgressSubscriptions).forEach((sub: EventEmitter<any>) => {
            sub.unsubscribe();
        });
    }

}

