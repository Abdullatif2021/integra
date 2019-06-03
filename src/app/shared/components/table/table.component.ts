import {Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewChecked, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewChecked {

    constructor(private cdr: ChangeDetectorRef) { }

    cells_size = [] ;
    @ViewChild('tableRow') tableRowElement;
    @Input() table: object = {} ;
    @Input() items: any = [] ;
    isLoading = true ;

    ngOnInit() {
    }

    loading(state) {
        this.isLoading = state ;
        console.log(state);
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

