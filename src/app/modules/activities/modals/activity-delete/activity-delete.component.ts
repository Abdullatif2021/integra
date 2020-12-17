import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';
import {ActivityActionsService} from '../../service/activity-action.service';
import {ActivitiesService} from '../../service/activities.service';
import {ModalComponent} from '../../../../shared/modals/modal.component';

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
      private activitiesService: ActivitiesService,
      private activityActionsService: ActivityActionsService

  ) {
    super();
    this.translateSelectorService.setDefaultLanuage();

  }

  ngOnInit() {
      this.items = this.activitiesService.selectactivities;
  }

  async run(modal) {
      modal.close();
      await this.activityActionsService.deleteActivity(this.items.map(item => item.id));
      this.activitiesService.reload.emit(true);
  }

}
