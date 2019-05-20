import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  constructor() { }

  @Input() placeholder : string = 'Search';
  @Input() style : string = 'normal';
  ngOnInit() {
  }

}
