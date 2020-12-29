import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-cols-based-table',
  templateUrl: './cols-based-table.component.html',
  styleUrls: ['./cols-based-table.component.css']
})
export class ColsBasedTableComponent implements OnInit, OnChanges {

  @Input() config ;
  @Input() data = {};
  @Output() select = new EventEmitter();
  @Output() expand = new EventEmitter();
  @Output() minimize = new EventEmitter();
  @Output() loadMore = new EventEmitter();
  loading = {} ;
  selected = [];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data || changes.config) {
        this.parseCurrentData();
        if (this.config && (!this.data || Object.keys(this.data).length)) {
            this.loadData();
        }
    }
  }

  reload() {
      this.data = null ;
      this.loadData();
  }

  loadData() {
      if (!this.config || !this.config.cols) {
          return ;
      }
      this.config.cols.forEach((col) => {
         if (typeof col.load === 'function') {
             col.__loaded = false ;
             if (!this.loading) {this.loading = {}; }
             if (!this.data) {this.data = {} ; }
             this.loading[col.id] = true ;
             this.data[col.id] = [] ;
             col.load(1).then(
                 _d => {
                     this.loading[col.id] = false ;
                     if (!_d.data || !_d.data.length) {
                         return col.__loaded = true ;
                     }
                     this.data[col.id] =  this.parseData(_d.data, col);
                 }
             ).catch( e => {
                 this.loading[col.id] = false ;
             });
         }
      });
  }

  selectItem(col, row) {
      row.__selected = !row.__selected ;
      row.__partially_selected = false ;
      this.toggleChildesSelect(col, row, row.__selected);
      this.updateSelected(row, col) ;
  }

  updateSelected(row, col) {
      this.selected = this.selected.filter(i => i.id !== row.id);
      if (row.__selected) {
          if (row.__partially_selected && col.expand.items && row[col.expand.items]) {
              this.selected.push({
                  id: row.id,
                  item: row,
                  except: row[col.expand.items].filter( i => !i.__selected).map(i => i.id),
                  selected: [],
              });
          } else {
              this.selected.push({
                  id: row.id,
                  item: row,
                  except: [],
                  selected: [],
              });
          }
      } else if (row.__partially_selected && col.expand.items && row[col.expand.items]) {
          this.selected.push({
              id: row.id,
              item: row,
              except: [],
              selected: row[col.expand.items].filter( i => i.__selected).map(i => i.id),
          });
      }
      this.select.emit(this.selected);
  }

  toggleChildesSelect(col, item, state) {
      if (!col.expand || !col.expand.items || !item[col.expand.items]) {
          return ;
      }
      item[col.expand.items] = item[col.expand.items].map(i => {i.__selected = state; return i ; } ) ;
  }

  selectSubItem(col, row, item) {
      item.__selected = !item.__selected ;
      this.checkIfRowIsPartiallySelected(col, row);
      this.updateSelected(row, col);
  }

  checkIfRowIsPartiallySelected(col, row) {
      if (!col.expand || !col.expand.items || !row[col.expand.items]) {
          return ;
      }
      row.__partially_selected = false ;
      row[col.expand.items].forEach(item => {
          if ((row.__selected && !item.__selected) || (item.__selected && !row.__selected)) {
              row.__partially_selected = true ;
          }
      });
      return row.__partially_selected;
  }

  expandItem(col, item) {
      if (!col.expand) { return ; }
      item.__expanded = !item.__expanded ;
      if (item.__expanded) {
          this.expand.emit({item: item, col: col});
      } else {
          this.minimize.emit({item: item, col: col});
      }
  }

  async loadMoreSubItems(col, row) {
      if (col.expand && typeof col.expand.loadMoreMethod !== 'function' || col.__all_loaded) {
          return ;
      }
      row.__page = row.__page ? row.__page + 1 : 1 ;
      row.__loading_sub_items = true ;
      const moreItems = this.parseExpandItems(await col.expand.loadMoreMethod(row, row.__page, col), col, row.__selected) ;
      row[col.expand.items] = row[col.expand.items].concat(moreItems);
      if (!moreItems || !moreItems.length) {
          row.__all_sub_items_loaded = true ;
      }
      row.__loading_sub_items = false ;
  }

  scrolled(col) {
    if (col.__loaded) { return ; }
    col.__page = col.__page ? col.__page + 1 : 2;
    this.loadMore.emit(col);
    if (col.load) {
        this.loading[col.id] = true ;
        col.load(col.__page).then((data) => {
            if (!data.data || !data.data.length) { col.__loaded = true ; }
            this.data[col.id] = this.data[col.id].concat(this.parseData(data.data, col));
            this.loading[col.id] = false ;
        }).catch( e => {
            this.loading[col.id] = false ;
        });
    }
  }

  parseCurrentData() {
    if (!this.config || !this.config.cols || !this.data) { return ; }
    this.config.cols.forEach(col => {
      if (!this.data[col.id]) { return ; }
      this.data[col.id].forEach(row => {
          this.parseRow(row, col);
      });
    });
  }

  parseData(data, col) {
      if (!this.config || !this.config.cols) { return ; }
      data.forEach(row => {
         this.parseRow(row, col);
      });
      return data ;
  }

  parseRow(row, col) {
      row.__col_id = col.id ;
      row.__col = col ;
      if (col.itemId) {
          if (typeof col.itemId === 'function') { row.id = col.itemId(row);
          } else { row.id = row[col.itemId]; }
      }
      if (typeof col.text === 'function') {
          row.__text = col.text(row) ;
      } else {
          row.__text = row[col.text] ;
      }
      if (col.expand && col.expand.items && row[col.expand.items]) {
          row[col.expand.items] = this.parseExpandItems(row[col.expand.items], col);
      }
  }

  parseExpandItems(items, col, selected = false) {
      return items.map((item) => {
          item.__selected = selected;
          if (typeof col.expand.display === 'function') {
              item.__display = col.expand.display(item);
          } else {
              item.__display = item[col.expand.display];
          }
          return item ;
      });
  }

}
