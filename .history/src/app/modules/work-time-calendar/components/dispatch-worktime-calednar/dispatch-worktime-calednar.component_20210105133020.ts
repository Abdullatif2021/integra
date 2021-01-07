import {Component , OnInit} from '@angular/core';
import {TablesConfig} from '../../../../config/tables.config';
import {WorkTimeService} from '../../service/work-time.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-dispatch-worktime-calednar',
  templateUrl: './dispatch-worktime-calednar.component.html',
  styleUrls: ['./dispatch-worktime-calednar.component.css']
})
export class DispatchWorktimeCalednarComponent implements OnInit {
  unsubscribe: Subject<void> = new Subject();


  postmenTableConfig = TablesConfig.simpleTable.postmenTable;
  config = {
      icon: '/assets/images/postman-icon.png',
      text: 'name',
      group_name: 'state'
  };

  data = [];

  baseDate = '2020-01-01';


  constructor(private worktimeservice: WorkTimeService) { }

  ngOnInit() {
    this.worktimeservice.getSubActivityCalender().pipe(takeUntil(this.unsubscribe)).subscribe(
        data => {
            this.data = data.data;
            console.log(data);
            
        });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
}
}
