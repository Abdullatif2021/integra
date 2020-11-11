import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PreDispatchAddDirectComponent} from './modals/pre-dispatch-add-direct/pre-dispatch-add-direct.component';
import {StreetsLocatingService} from '../../service/locating/streets-locating.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private streetsLocatingService: StreetsLocatingService,
      private translate: TranslateService,

  ) {
      translate.setDefaultLang('itly');
      const browserLang = translate.getBrowserLang();
    }
  active_tab = 'to-deliver';
  actions_only = false ;
  ngOnInit() {
    // set active tab to match the current route
    if (this.router.url.substr(1)) {
      this.active_tab = this.router.url.substr(1) ;
    }
    // subscribe to router changes and change the active tab
    this.router.events.subscribe((event) => {
      if (! (event instanceof NavigationEnd) ) { return ; }
      if (this.router.url.substr(1)) {
          this.active_tab = this.router.url.substr(1);
      } else { this.active_tab = 'to-deliver' ; }
    });
    this.activatedRoute.queryParams.subscribe(params => {
        if (typeof params['actionsonly'] !== 'undefined') {
            this.actions_only = true ;
        }
    });
    setTimeout(() => { this.streetsLocatingService.startLocating(); }, 3000);

  }

}
