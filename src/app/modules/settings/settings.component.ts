import { Component, OnInit } from '@angular/core';
import {TablesConfig} from '../../config/tables.config';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {SettingsService} from '../../service/settings.service';
import {ApiResponseInterface} from '../../core/models/api-response.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  subSettings: any = {
    general: [
      {id: 'service-time', name: 'Tempo di servizio', route: '/settings'},
      {id: 'pagination-options', name: 'Pagination Options', route: '/settings/pagination'}
    ],
    mapProvider: [
      // {id: 'map-box', name: 'MapBox', route: '/settings/map-box'},
      // {id: 'google-maps', name: 'Google Maps', route: '/settings/google-maps'},
      // {id: 'all-cities', name: 'Tutto città', route: '/settings/all-cities'}
    ],
  }
  settings = [
    {id: 'general', name: 'General'},
    {id: 'mapProvider', name: 'Map Provider', route: (subSetting) => '/settings/map/' + subSetting.id}
  ];

  activeSetting: any ;
  activeSubSetting: any ;


  settingsTable = TablesConfig.simpleTable.settingsTable ;
  subSettingsTable = TablesConfig.simpleTable.subSettingsTable ;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private settingsService: SettingsService
  ) {
      router.events.subscribe((_route) => {
        if (_route instanceof NavigationEnd) { this.updateActiveTabFromRoute() ; }
      });
  }

  ngOnInit() {
      this.activatedRoute.data.subscribe((d) => {
          if ( d.res.status === 'success') {
              this.subSettings.mapProvider = d.res.data ;
          }
          this.updateActiveTabFromRoute() ;
      });
  }

  updateActiveTab(event) {
    this.activeSetting = event;
  }

  routeTo(event) {
    if (event.route) {
        this.router.navigate([event.route]);
    } else if (typeof this.activeSetting.route === 'function') {
        this.router.navigate([this.activeSetting.route(event)]);
    }
  }

  updateActiveTabFromRoute() {
    let active = {setting: this.settings[0], subSetting: this.subSettings[this.settings[0].id]} ;
    this.settings.forEach((setting) => {
      this.subSettings[setting.id].forEach( (subSetting) => {
        if ( (subSetting.route === this.router.url)
            || (typeof  setting.route === 'function' && setting.route(subSetting) === this.router.url)) {
          active = {setting: setting, subSetting: subSetting} ;
        }
      });
    });
    this.activeSetting = active.setting ;
    this.activeSubSetting = active.subSetting ;
  }

}
