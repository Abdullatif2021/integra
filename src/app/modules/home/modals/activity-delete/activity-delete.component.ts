import { ActivitiessService } from '../../modules/activities/service/activities.service';
import { browser } from 'protractor';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import { ActivitiesService } from '../../service/activities.service';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';
import {ActivityActionsService} from '../../service/activity-action.service';



@Component({
  selector: 'app-activity-delete',
  templateUrl: './activity-delete.component.html',
  styleUrls: ['./activity-delete.component.css']
})
export class ActivityDeleteComponent extends ModalComponent implements OnInit {

  items = [];

  constructor(
      private translate: TranslateService,
      private translateSelectorService: TranslateSelectorService,
      private activitiessService: ActivitiessService,
      private activitiesService: ActivitiesService,

      private activityaction: ActivityActionsService

  ) {
    super();
    this.translateSelectorService.setDefaultLanuage();

  }

  ngOnInit() {
      this.items = this.activitiesService.selectactivity;
      console.log(this.items);
  }

  async run(modal) {
      modal.close();
      await this.activityaction.deleteActivity(this.items.map(item => item.id));
  }

}
