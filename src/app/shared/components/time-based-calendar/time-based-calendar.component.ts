import {Component, Input, EventEmitter , Output, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SubActivitiesCalendarService} from '../../../modules/activities/modules/sub-activities-calendar/service/sub-activities-calendar.service';

@Component({
  selector: 'app-time-based-calendar',
  templateUrl: './time-based-calendar.component.html',
  styleUrls: ['./time-based-calendar.component.css']
})
export class TimeBasedCalendarComponent implements OnInit, OnChanges {

  @Input() config ;
  @Input() data ;
  @Input() baseDate ;
  @Output() weekIndexChanged = new EventEmitter();
  title = '' ;
  work_month ;
  work_year ;
  current_week_index = 0 ;
  _days = [] ;
  loading = true ;
  constructor(private worktimecalender: SubActivitiesCalendarService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.formatData() ;
      if (this.data) {this.loading = false;}
    }
    if (changes.baseDate) {
        this.tableTitle();
    }
  }

  tableTitle() {
      const start = new Date(this.baseDate);
      const end = new Date(this.baseDate);
      end.setDate(start.getDate() + 7);
      this.work_month = end.getMonth();
      this.work_year = end.getFullYear();
      this.title = `${start.getDate()} - ${end.getDate()}`;
      this._days[0] = start.getDay();
      for (let i = 1; i < 7; ++i) {
          start.setDate(start.getDate() + 1);
          this._days[i] = start.getDay();
      }
  }

  formatData() {
    if (!this.data) { return ; }
    this.data.forEach(section => {
      if (!section.items) { return ; }
      section.items.forEach(item => {
        if (!item.days) { return ; }
        const _days_fill = [0, 0, 0, 0, 0, 0, 0];
        const _init_date: Date = new Date(this.baseDate);
        let _days_counter = 0 ;
        _days_fill.forEach((fillDay, idx) => {
            if (_days_counter > item.days.length) { return ; }
            // update the match date.
            let _current_date = new Date(_init_date.getTime()) ;
            _current_date = new Date(_current_date.setDate(_current_date.getDate() + idx));
            const item_day = new Date(item.days[_days_counter]);
            if (_current_date.getTime() === item_day.getTime()) {
                _days_fill[idx] = (!_days_counter ? 2 : 1) + (_days_counter === item.days.length - 1 ? 2 : 0);
                _days_counter++ ;
            }
        });
        item._days_fill = _days_fill;
      });
    });
  }

  changeWeekIndex(direction) {
    this.current_week_index += direction;
    this.weekIndexChanged.emit(this.current_week_index);
  }

  setLoadingSate(state) {
      this.loading = state;
  }

}
