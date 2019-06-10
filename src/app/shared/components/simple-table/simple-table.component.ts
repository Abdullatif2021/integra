import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css']
})
export class SimpleTableComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() table: object = {
    title: '',
    icon: '',
    searchPlaceHolder: ''
  } ;
  @Input() items ;
  @Input() getMethod ;
  @Output() selected = new EventEmitter<object>() ;
  _selected: string = null ;
  page = 1 ;
  rpp = 25 ;
  searchValue: string = null ;
  pagination: any = { total: 0, totalProduct: 0 };
  loaded = false ;
  loading = true ;
    subscription: any = false ;

  ngOnInit() {
    // this.loadData(false);
  }

  ngOnChanges() {
    this.loadData(false);
  }

  loadData(append) {
    if (typeof this.getMethod !== 'function') { return ; }
    this.loading = true ;

    if (!append) { this.items = [] ; }
    if ( this.subscription ) {
        this.subscription.unsubscribe();
    }
    this.subscription = this.getMethod(this.page, this.rpp, this.searchValue).subscribe((res: ApiResponseInterface) => {
        if (res.status === 'success') {
          if (append) {
            this.items = this.items.concat(res.data);
          } else { this.items = res.data ; }
          this.pagination = res.pagination ;
          this.loaded = true ;
          this.loading = false ;
        }
    });
    return this ;
  }

  loadMore() {
    if (this.rpp * this.page < this.pagination.total && this.loaded) {
      this.page++ ;
      this.loadData(true) ;
    }
  }

  search(event) {
    this.searchValue = event ;
    this.page = 1 ;
    this.loadData(false) ;
  }

  selectItem(item) {
    this.selected.emit(item) ;
    this._selected = item ;
  }

  reset() {
    if (this.selected !== null) {
        this.selected.emit(null);
    }
    this._selected = null ;
  }
}
