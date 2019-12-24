import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    AfterViewChecked,
    EventEmitter,
    Output,
    Host,
    SimpleChanges, OnChanges, OnDestroy
} from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {

    constructor(private cdr: ChangeDetectorRef) { }

    cells_size = [] ;
    @ViewChild('tableRow') tableRowElement;
    @Input() table: any = {} ;
    @Input() items: any = [] ;
    @Input() parent: any ;
    isLoading = true ;
    @Output() selected = new EventEmitter() ;
    selectedProducts = [] ;
    isCollapsed = {} ;
    itemsProgressSubscriptions = {} ;
    itemsProgress = {} ;
    itemsProgressWarning = {} ;

    ngOnInit() {
    }

    loading(state) {
        this.isLoading = state ;
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
    isSelectedRow(item) {
        return this.selectedProducts.find((elm) => elm.id === item.id ) ;
    }

    subToProgress(item, action) {
        if (typeof action.progress !== 'undefined' && typeof this.itemsProgressSubscriptions[item.id] === 'undefined') {
            const handle = action.progress(item, this.parent);
            if (!handle) {
               return '';
            }
            this.itemsProgressSubscriptions[item.id] = handle.subscribe(
                state => {
                    if (state.progress) {
                        this.itemsProgress[item.id] = state.progress.toFixed(1) ;
                    }
                    if (state.warning) {
                        this.itemsProgressWarning[item.id] = true ;
                    }
                }
            ) ;
        }
        return '';
    }

    selectItem(item) {
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
            this.selectedProducts = [];
        }
    }

    trackItems(item) {
        return item.id ;
    }

    ngOnDestroy() {
        Object.values(this.itemsProgressSubscriptions).forEach((sub: EventEmitter<any>) => {
            sub.unsubscribe();
        });
    }

}

