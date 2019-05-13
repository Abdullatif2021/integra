import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css']
})
export class SimpleTableComponent implements OnInit {

  constructor() { }

  @Input() table : object = {
    title:'',
    icon:'',
    searchPlaceHolder: ''
  } ;
  @Input() items ;

  ngOnInit() {
  }

}
