import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  active_tab = 'to-deliver'
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
  }

}
