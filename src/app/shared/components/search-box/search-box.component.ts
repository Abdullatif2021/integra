import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
})
export class SearchBoxComponent implements OnInit {

  constructor() { }

  @Input() placeholder = 'Search';
  @Input() style = 'normal';
  @Input() value = '';
  @Output() keydown = new EventEmitter<any>();
  @Output() changed = new EventEmitter<string>();
  ngOnInit() {
  }

  change(event) {
    this.changed.emit(event.target.value);
  }

  handleKeyDown(event) {
    this.keydown.emit(event);
  }

  setValue(value) {
    this.value = value;
  }

}
