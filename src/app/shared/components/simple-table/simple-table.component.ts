import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {Observable} from 'rxjs';

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
  @Input() multi = true ;
  @Output() changed = new EventEmitter<object>() ;
  @Input() _selected: any = [] ;
  _items: any = [] ;
  _all_selected = true ;
  page = 1 ;
  rpp = 25 ;
  searchValue: string = null ;
  pagination: any = { total: 0, totalProduct: 0 };
  loaded = false ;
  loading = true ;
  subscription: any = false ;
  currentOrder = null ;
  @Input() selected = {} ;

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

    if (!append) { this.items = [] ; this._all_selected = true ; this.selected = {}; }
    if ( this.subscription ) { this.subscription.unsubscribe(); }

    const observable = this.getMethod(this.page, this.rpp, this.searchValue, this.currentOrder) ;
    if (!observable) {
      this.items = [] ;
      this.page = 1 ;
      this.loaded = true ;
      this.loading = false ;
    } else {
        this.subscription = observable.subscribe((res: ApiResponseInterface) => {
            this.handleResponse(res);
        });
    }
    return this ;
  }

  handleResponse(res: ApiResponseInterface) {
    if (res.status === 'success' || res.success) {
      this.items = this.items.concat(res.data) ;
      this.pagination = res.pagination ? res.pagination : {totalProduct: undefined} ;
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
    this._all_selected = true ;
    this.selected = {} ;
    this.changed.emit({all: this._all_selected, items: Object.keys(this.selected), search: this.searchValue});
    if (this.table.searchMethod && typeof this.table.searchMethod === 'function') {
      return this.items = this.table.searchMethod(this._items, event) ;
    }
    this.loadData(false) ;
  }

  selectItem(item) {
    if (!this.multi) { // if the table was single element select.
      this.selected = item ;
      return this.changed.emit(item) ;
    }
    // handle multiple items select.
    if (!item) { // if user clicked on all.
      this.selected = {} ;
      this._all_selected = true ;
      return this.changed.emit({all: true, items: [], search: this.searchValue, order: this.currentOrder});
    }
    if (this.selected[item.id]) { // if the item was already selected, remove it.
      delete this.selected[item.id];
      if (!Object.keys(this.selected).length) {
        this._all_selected = true ;
      }
      return this.changed.emit({all: this._all_selected,
          items: Object.keys(this.selected), search: this.searchValue, order: this.currentOrder});
    }
    this.selected[item.id] = item ; // select the item
    this._all_selected = false ;
    return this.changed.emit({all: this._all_selected,
        items: Object.keys(this.selected), search: this.searchValue, order: this.currentOrder});
      // if (!this.multi) {
    //   this._selected = item ;
    //   return this.changed.emit(item) ;
    // }
    // if (!item) {
    //   this._selected = [] ;
    //   this._all_selected = !this._all_selected;
    //   return this.changed.emit({all: this._all_selected, items: this._selected, search: this.searchValue, order: this.currentOrder});
    // }
    // for (let i = 0; i < this._selected.length; ++i) {
    //   if (!this._selected[i]) {
    //       this._selected.splice(i, 1);
    //   } else if (this._selected[i] === item.id) {
    //     this._selected.splice(i, 1);
    //     return this.changed.emit({all: this._all_selected, items: this._selected, search: this.searchValue, order: this.currentOrder});
    //   }
    // }
    // this._selected.push(item.id);
    // return this.changed.emit({all: this._all_selected, items: this._selected, search: this.searchValue, order: this.currentOrder});
  }


  changeOrder(order) {
    this.currentOrder = order ;
    this.page = 1 ;
    this.loadData(false) ;
    this.selected = {} ;
    this._all_selected = true ;
    this.changed.emit({all: true, items: [], search: this.searchValue, order: this.currentOrder});
  }

  reload() {
    this.page = 1 ;
    this.loaded = false ;
    this.loading = true ;
    this.selected = {} ;
    this._all_selected = true ;
    this.loadData(false) ;
  }

  clearData() {
    this.page = 1;
    this.loaded = false ;
    this.loading = false ;
    this.selected = {} ;
    this._all_selected = true ;
    this.items = [] ;
  }

}
