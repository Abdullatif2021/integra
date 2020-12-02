import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../service/settings.service';
import {ApiResponseInterface} from '../../../../../core/models/api-response.interface';
import {Observable} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-time',
  templateUrl: './service-time.component.html',
  styleUrls: ['./service-time.component.css']
})
export class ServiceTimeComponent implements OnInit {

  constructor(
      private settingsService: SettingsService , private translate: TranslateService,
      ) {}
  settings = [];
  subscription ;
  loading = true ;

  ngOnInit() {
    this.settingsService.getProductStatusType().subscribe((res: ApiResponseInterface) => {
      if (res.status === 'success') {
        this.settings = res.data ;
        this.loading = false ;
      }
    });
  }

  delete(setting) {
    this.settings = this.settings.filter((elm) => {
      return setting.id !== elm.id ;
    });
  }

  edit(event, field, setting) {
    setting[field] = event.target.value ;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.settingsService.editProductStatusType([setting]).subscribe((res: ApiResponseInterface) => {
      if (res.status === 'success') {
        // this.settings = res.data ;
      }
    });
  }

  trackSettings(index, item) {
    return item.id ;
  }
}
