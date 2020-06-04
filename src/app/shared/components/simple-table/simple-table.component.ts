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
  selectedSave ;
  changeState = 'user';

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

  loadData(append: boolean, keep_selected = false) {

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
            this.handleOldSelected(keep_selected);
        });
    }
    return this ;
  }

  handleOldSelected(keep_selected) {
    if (!keep_selected || !this.selectedSave) {return this.selectedSave = null;}
    console.log(this.selectedSave);
    Object.keys(this.selectedSave).forEach((key) => {
      if (this.items.find((i) => i.id === this.selectedSave[key].id)) {
        this.selected[key] = this.selectedSave[key];
        this._all_selected = false;
      }
    });
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
    this.changeState = 'user'; // value changed because of user change.
    this.loadData(false) ;
  }

  resetIfAuto() {
    if (this.changeState === 'user') { return 0; }
    this.searchValue = '' ;
    this.page = 1 ;
    this._all_selected = true ;
    this.selected = {} ;
    this.changeState = 'user'; // value changed because of user change.
    return 1;
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
  }


  changeOrder(order) {
    this.currentOrder = order ;
    this.page = 1 ;
    this.loadData(false) ;
    this.selected = {};
    this._all_selected = true ;
    this.changed.emit({all: true, items: [], search: this.searchValue, order: this.currentOrder});
  }

  reload(keep_selected = false) {
    this.loaded = false ;
    this.loading = true ;
    this.page = 1 ;
    if (keep_selected) {
      this.selectedSave = this.selected;
    }
    this.selected = {} ;
    this._all_selected = true ;
    this.loadData(false, keep_selected) ;
  }

  clearData() {
    this.page = 1;
    this.loaded = false ;
    this.loading = false ;
    this.selected = {} ;
    this._all_selected = true ;
    this.items = [] ;
  }

  setSearchValue(value) {
    this.changeState = 'auto'; // value changed because of code change.
    this.searchValue = value;
  }

}
