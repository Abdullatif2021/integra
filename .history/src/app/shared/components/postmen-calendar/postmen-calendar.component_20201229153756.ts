import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileSystemFileEntry} from 'ngx-file-drop';
import {AppConfig} from '../../../config/app.config';
import {CalenderService} from '../../../modules/home/service/calender.service';
import {SnotifyService} from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-postmen-calendar',
  templateUrl: './postmen-calendar.component.html',
  styleUrls: ['./postmen-calendar.component.css']
})
export class PostmenCalendarComponent implements OnInit, OnChanges {

  @Input() data ;
  @Input() view = 'week';
  @Input() detailsGetMethod = null;
  @Input() availableUsersGetMethod = null;
  @Input() detailsStatuses = [];
  @Input() setNoteUpdateMethod = null;
  @Output() setAssigned = new EventEmitter();
  @Output() dayAttachmentSelected = new EventEmitter();
  @Output() dayNoteUpdated = new EventEmitter();
  @Output() postmanDayNoteUpdated = new EventEmitter();
  @Output() weekIndexChanged = new EventEmitter();
  @Output() dayChanged = new EventEmitter();
  @Output() postmanDisplayed = new EventEmitter();

  current_day = 0;
  save_day_index = null;
  days = [  'shared.postmen_calendar.days.monday',
            'shared.postmen_calendar.days.tuesday',
            'shared.postmen_calendar.days.wednesday',
            'shared.postmen_calendar.days.thursday',
            'shared.postmen_calendar.days.friday',
            'shared.postmen_calendar.days.saturday',
            'shared.postmen_calendar.days.sunday'];
  availableUsers = [];

  @ViewChild('editPostmanNoteModal') editPostmanNoteModal ;
  @ViewChild('showMoreAvailablePostmenModal') showMoreAvailablePostmenModal ;
  @ViewChild('confirmAssignModal') confirmAssignModal ;
  @ViewChild('confirmStatusChangeModal') confirmStatusChangeModal ;
  @ViewChild('editDayNoteModal') editDayNoteModal ;
  @ViewChild('editDayAttachmentModal') editDayAttachmentModal ;
  activepostman = null ;
  activeday = null;
  selected_file = null ;
  displayed_postman = null ;
  formatted_date = '' ;
  monthes = [
        'shared.postmen_calendar.months.january',
        'shared.postmen_calendar.months.february',
        'shared.postmen_calendar.months.march',
        'shared.postmen_calendar.months.april',
        'shared.postmen_calendar.months.may',
        'shared.postmen_calendar.months.june',
        'shared.postmen_calendar.months.july',
        'shared.postmen_calendar.months.august',
        'shared.postmen_calendar.months.september',
        'shared.postmen_calendar.months.october',
        'shared.postmen_calendar.months.november',
        'shared.postmen_calendar.months.december'
  ];
  details = null ;
  moreData = [] ;
  saved_event = null;
  current_day_info = {delivered_expanded: false, not_delivered_expanded: false};

  loadMorePage = 1;
  @Input() loadMoreMethods = null ;
  loadMoreSave = null;
  AppConfig = AppConfig;
  current_week_index = 0 ;
  loading_more = false ;
  data_sizes = <any>{};
  week_range = [0, 1, 2, 3, 4, 5, 6];
  constructor(
      private modalService: NgbModal,
      private calenderService: CalenderService,
      private snotifyService: SnotifyService,
      private translate: TranslateService
    ) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      console.log('changes');
      if (changes.data) {
          this.handleDataChanges(changes);
      }
  }

  handleDataChanges(changes) {
      if (this.save_day_index !== null && this.data) {
          this.current_day = this.save_day_index ;
          this.save_day_index = null;
      } else {
          this.current_day = 0;
      }
      this.displayed_postman = null ;
      this.formatted_date = ``;
      if (!this.data) {
          this.data = [
              {skeleton: true}, {skeleton: true}, {skeleton: true}, {skeleton: true}, {skeleton: true},
              {skeleton: true}, {skeleton: true}
          ];
          return this.data_sizes = {postmen: [0], revisore: [0], availablePostmen: [0], availableRevisore: [0]};
      }
      if (!this.data.length) {
          return this.data = null ;
      }
      const date = new Date(this.data[0].dayDate.split('/').reverse().join('-'));

    let currentMonth = this.monthes[date.getMonth()];
    this.translate.get(`${currentMonth}`).subscribe(( data: any ) =>  {
        this.formatted_date = `
            ${this.data[0].dayNumber} - ${this.data[this.data.length - 1].dayNumber}
             ${data} ${date.getFullYear()}
          `.trim();
    });

    // this.translate.get('menu').subscribe((data:any)=> {        console.log(data);       })


      this.data_sizes = {postmen: 0, revisore: 0, availablePostmen: 0, availableRevisore: 0 };
      this.data.forEach( day => {
          Object.keys(this.data_sizes).forEach(key => {
              this.data_sizes[key] = Math.max(day[key] ? day[key].length : 1, this.data_sizes[key]);
          });
      });
      Object.keys(this.data_sizes).forEach(key => {
          this.data_sizes[key] = new Array(this.data_sizes[key]).fill(0, 0, this.data_sizes[key]);
      });
      console.log(this.data);
  }

  openEditPostmanNoteModal(event, postman, day) {
      event.stopPropagation();
      this.activepostman = postman ;
      this.activeday = day;
      this.modalService.open(this.editPostmanNoteModal);
  }

  showMore(day, type, modal = true) {
      if (this.loading_more) { return ; }
      if (!this.loadMoreMethods || !this.loadMoreMethods[type] || typeof this.loadMoreMethods[type] !== 'function') {
          return ;
      }
      this.loadMoreSave = {
          day: day,
          type: type
      };
      this.loadMorePage += 1;
      this.moreData = this.moreData.concat([{skeleton: true}, {skeleton: true}, {skeleton: true}, ]);
      this.loading_more = true ;
      this.loadMoreMethods[type](day.dayDate, this.loadMorePage).subscribe(
          data => {
              for (let i = 0; i < 3; ++i) { this.moreData.pop(); }
              this.moreData = this.moreData.concat(data.data);
              this.loading_more = false;
          }
      );
      if (modal) {
          // const _day = this.data.find(d => d.dayDate === day);
          console.log(type);

          if (day[type]) {
              this.moreData = [...day[type], ...this.moreData];
          }
          this.modalService.open(this.showMoreAvailablePostmenModal, {backdrop: 'static', keyboard: false});
      }
  }

  showEvenMore() {
      if (!this.loadMoreSave) {
          return ;
      }
      this.showMore(this.loadMoreSave.day, this.loadMoreSave.type, false);
  }

  closeShowMoreModal(modal) {
      modal.close();
      this.loadMoreSave = null;
      this.moreData = [];
      this.loadMorePage = 1;
  }

  savePostmanNote(input) {
      this.activepostman.note = input.value.trim();
      this.postmanDayNoteUpdated.emit({postman: this.activepostman.id, day: this.activeday.dayDate, note: input.value.trim()});
  }

  openEditDayNoteModal(day, idx) {
      day._idx = idx ;
      this.activeday = day ;
      this.modalService.open(this.editDayNoteModal);
  }

  saveDayNote(input) {
      this.activeday.note = input.value.trim() ;
      this.dayNoteUpdated.emit({day: this.activeday.dayDate, note: input.value.trim()});
  }

  openEditDayAttachmentModal(day, idx) {
      day._idx = idx ;
      this.activeday = day ;
      this.modalService.open(this.editDayAttachmentModal, {backdrop: 'static', keyboard: false});
  }

  fileSelected(event) {
      if (event.length) {
          this.selected_file = event[0];
      }
  }

  saveDayAttachment() {
      if (this.selected_file) {
          const fileEntry = this.selected_file.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
              this.dayAttachmentSelected.emit({day: this.activeday.dayDate, file: file, dayObj: this.activeday});
              this.selected_file = null ;
          });
      }
  }

  assignToUser(event, confirm = false) {
      if (!event) { return ; }
      if (!confirm) {
          this.saved_event = event;
          return this.modalService.open(this.confirmAssignModal);
      }
      this.setAssigned.emit({sets: [this.details.id], user: this.saved_event.id});
  }

  detailsStatusChanged(event, confirm = false) {
      if (!confirm) {
          this.saved_event = event;
          return this.modalService.open(this.confirmStatusChangeModal);
      }
      if (typeof this.saved_event.handler === 'function') {
          this.saved_event.handler(this.details);
      }
  }

  resetStatusSelect() {
      this.details.status = null;
  }

  async addSetNote(event, type) {
      if (!this.displayed_postman || typeof this.setNoteUpdateMethod !== 'function') {
          return ;
      }
      const note = await this.setNoteUpdateMethod(event.text, type, this.displayed_postman, event.file);
      if (!note) {
          return ;
      }
      if (type === 'internal_note') {
          this.details.internalNotes = [note.data, ...this.details.internalNotes];
      } else if (type === 'postman_note') {
          this.details.postmanNotes = [note.data, ...this.details.postmanNotes];
      }
  }

  async displayedPostman(postman, day, emit = true) {
      if (!postman) {
          this.displayed_postman = null;
          return this.postmanDisplayed.emit(null);
      }
      this.displayed_postman = postman;
      if (day) {
          this.setDay(day);
      }
      if (emit) {
          this.postmanDisplayed.emit({postman: postman, day: day});
      }
      this.details = null ;
      if (typeof this.detailsGetMethod !== 'function' || typeof this.availableUsersGetMethod !== 'function') {
          return ;
      }

      // get the available postmen.
      const ap = await this.availableUsersGetMethod(postman).toPromise().catch(e => {});
      if (!ap) { return this.snotifyService.error(this.translate.instant('shared.postmen_calendar.error_massege'),
       {showProgressBar: false}); }
      this.availableUsers = ap.data;

      // get the details.
      this.detailsGetMethod(postman).subscribe( data => {
          this.details = data.data;
          if (this.details.user && !this.availableUsers.find((item) => item.id === this.details.user.id)) {
              this.availableUsers.push(this.details.user);
          }
          if (this.details.user) {
              this.details.user = {name: this.details.user.full_name, id: this.details.user.id};
          }
          if (this.details.status) {
              this.details.status = this.detailsStatuses.find(state => state.id === this.details.status);
          }
      });
  }

  setDay(date) {
      const idx = this.data.map(item => item.dayDate).indexOf(date) ;
      if (idx > -1) {
          this.current_day = idx;
      }
  }

  changeWeekIndex(direction) {
      this.current_week_index += direction;
      this.weekIndexChanged.emit(this.current_week_index);
  }


  /**
   * when the user changes the current day.
   * @param step
   * emits an object { date: string, reload: boolean } to the dayChanged.
   */
  changeCurrentDay(step) {
      // if the day exists at the prev week.
      if ((this.current_day === 0 && step < 0)) {
          this.save_day_index = 7 + step;
          const date = this.calenderService.getDate(this.data[this.current_day].dayDate, -1) ;
          this.dayChanged.emit({ date: date, reload: false});
          return this.changeWeekIndex(-1);
      }
      // if the day exists at the next week.
      if (this.current_day >= this.data.length - 1 && step > 0) {
          const date = this.calenderService.getDate(this.data[this.current_day].dayDate, 1);
          this.dayChanged.emit({ date: date,  reload: false});
          return this.changeWeekIndex(1);
      }
      // if the day exists at this week.
      this.current_day += step;
      this.dayChanged.emit({
          date: this.data[this.current_day].dayDate,
          reload: true
      });
  }

  clearSelectedFile() {
      this.selected_file = null;
  }
}
