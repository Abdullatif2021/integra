import { TranslateService} from '@ngx-translate/core';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  constructor(private translate: TranslateService) {

  }

  @Input() active_tab = 'to-deliver';

  ngOnInit() {
  }

}
