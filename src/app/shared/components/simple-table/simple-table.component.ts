import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css']
})
export class SimpleTableComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() table: any = {
    title: '',
    icon: '',
    searchPlaceHolder: '',
    custom: false,
    searchMethod: false,
  } ;
  @Input() items ;
  @Input() getMethod ;
  @Output() changed = new EventEmitter<object>() ;
  @Input() _selected: string = null ;
  _items: any = [] ;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this._items = this.items ;
      this.loading = false ;
    } else {
        this.loadData(false);
    }
  }

  loadData(append: boolean) {

    if (typeof this.getMethod !== 'function') {
      if (this.items) { this.loading = false ; }
      return false ;
    }
    this.loading = true ;

    if (!append) { this.items = [] ; }
    if ( this.subscription ) { this.subscription.unsubscribe(); }

    this.subscription = this.getMethod(this.page, this.rpp, this.searchValue)
        .subscribe((res: ApiResponseInterface) => {
          this.handleResponse(res);
        });

    return this ;
  }

  handleResponse(res: ApiResponseInterface) {
    if (res.status === 'success') {
      this.items = this.items.concat(res.data) ;
      this.pagination = res.pagination ;
      this.loaded = true ;
      this.loading = false ;
    }
  }

  loadMore() {
    if (this.rpp * this.page < this.pagination.total && this.loaded && !this.loading) {
      this.page++ ;
      this.loadData(true) ;
    }
  }

  search(event) {
    this.searchValue = event ;
    this.page = 1 ;
    if (this.table.searchMethod && typeof this.table.searchMethod) {
      return this.items = this.table.searchMethod(this._items, event) ;
    }
    this.loadData(false) ;
  }

  selectItem(item) {
    this.changed.emit(item) ;
    this._selected = item ;
  }

  reload() {
    this.page = 1 ;
    this.loaded = false ;
    this.loading = true ;
    this.loadData(false) ;
  }

}
