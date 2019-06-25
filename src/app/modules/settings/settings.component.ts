import { Component, OnInit } from '@angular/core';
import {TablesConfig} from '../../config/tables.config';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  subSettings: any = {
    general: [
      {id: 'service-time', name: 'Tempo di servizio', route: '/settings'}
    ],
    mapProvider: [
      {id: 'map-box', name: 'MapBox', route: '/settings/map-box'},
      {id: 'google-maps', name: 'Google Maps', route: '/settings/google-maps'},
      {id: 'all-cities', name: 'Tutto città', route: '/settings/all-cities'}
    ]
  }
  settings = [
    {id: 'general', name: 'General'},
    {id: 'mapProvider', name: 'Map Provider'}
  ];

  activeSetting: any ;
  activeSubSetting: any ;


  settingsTable = TablesConfig.simpleTable.settingsTable ;
  subSettingsTable = TablesConfig.simpleTable.subSettingsTable ;

  constructor(private router: Router) {
      router.events.subscribe((_route) => {
        if (_route instanceof NavigationEnd) { this.updateActiveTabFromRoute() ; }
      });
  }

  ngOnInit() {
      this.updateActiveTabFromRoute() ;
  }

  updateActiveTab(event) {
    this.activeSetting = event;
  }
  routeTo(event) {
    this.router.navigate([event.route]);
  }
  updateActiveTabFromRoute() {
    let active = {setting: this.settings[0], subSetting: this.subSettings[this.settings[0].id]} ;
    this.settings.forEach((setting) => {
      this.subSettings[setting.id].forEach( (subSetting) => {
        if (subSetting.route === this.router.url) {
          active = {setting: setting, subSetting: subSetting} ;
        }
      });
    });
    this.activeSetting = active.setting ;
    this.activeSubSetting = active.subSetting ;
  }

}
