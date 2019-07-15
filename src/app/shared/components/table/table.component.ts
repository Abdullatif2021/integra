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
    SimpleChanges, OnChanges
} from '@angular/core';
import {PreDispatchComponent} from '../../../modules/home/components/pre-dispatch/pre-dispatch.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewChecked, OnChanges {

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

}

