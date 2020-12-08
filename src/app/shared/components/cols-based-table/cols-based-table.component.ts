import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-cols-based-table',
  templateUrl: './cols-based-table.component.html',
  styleUrls: ['./cols-based-table.component.css']
})
export class ColsBasedTableComponent implements OnInit, OnChanges {

  @Input() config ;
  @Input() data = {};

  selected = {} ;
  all_selected_items = [] ;

  @Output() select = new EventEmitter();
  @Output() expand = new EventEmitter();
  @Output() minimize = new EventEmitter();
  @Output() loadMore = new EventEmitter();
  loading = {} ;

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

  selectItem(col, item) {
    item.selected = !item.selected ;
    if (item.selected) {
        this.all_selected_items.push(item);
        if (!this.selected[col.id]) {
          this.selected[col.id] = [item];
        } else { this.selected[col.id].push(item); }
    } else {
      this.all_selected_items = this.all_selected_items.filter(i => i.id !== item.id && i.__col_id === item.__col_id);
      this.selected[col.id] = this.selected[col.id].filter(i => i.id !== item.id);
    }
    this.select.emit({
        selected: this.selected,
        all_selected_items: this.all_selected_items
    });
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
      if (typeof col.text === 'function') {
          row.__text = col.text(row) ;
      } else {
          row.__text = row[col.text] ;
      }
      if (col.expand) {
          let expand_id = -1 ;
          col.expand.forEach(expand => {
              ++expand_id;
              expand._id = expand_id;
              if (typeof expand.value === 'function') {
                  row[`__expand_${expand_id}`] = expand.value(row);
              } else {
                  row[`__expand_${expand_id}`] = row[expand.value];
              }
          });
      }
  }

}
