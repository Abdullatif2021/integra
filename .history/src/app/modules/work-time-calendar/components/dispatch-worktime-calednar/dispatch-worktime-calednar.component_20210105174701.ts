import { ActivitiesService } from './../../../activities/service/activities.service';
import {Component , OnInit} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {WorkTimeService} from '../../service/work-time.service';
import { takeUntil, map } from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dispatch-worktime-calednar',
  templateUrl: './dispatch-worktime-calednar.component.html',
  styleUrls: ['./dispatch-worktime-calednar.component.css']
})
export class DispatchWorktimeCalednarComponent implements OnInit {
  unsubscribe: Subject<void> = new Subject();
  selected_Activity = null;


  activityTableConfig = TablesConfig.simpleTable.activity;
  config = {
      icon: '/assets/images/subb.png',
      text: 'activityName',
      group_name: 'state'
  };

  data = [];
  baseDate = 0;
  calender_current_week = 0;

  activityGetMethod = () => this.activitiesService.getSubActivities();

  constructor(private worktimeservice: WorkTimeService , private activitiesService: ActivitiesService ) { }

  ngOnInit() {
    this.worktimeservice.getSubActivityCalender( this.calender_current_week , this.selected_Activity.map(p => p.id)).pipe(takeUntil(this.unsubscribe)).subscribe(
        data => {
            this.data = data.data.data;
            this.baseDate = data.data.baseDate.split('/').reverse().join('-');
            console.log(data);
            
        });
  }
  changeCalenderWeekIndex(event) {
    this.calender_current_week = event;
    this.ngOnInit();
}
changeActivity(event) {
  this.selected_Activity = event;
  this.ngOnInit();
}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
}
}
