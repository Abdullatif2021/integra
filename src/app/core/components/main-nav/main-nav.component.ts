import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  constructor() { }

  @Input() active_tab : string = 'to-deliver';

  ngOnInit() {
  }

}
