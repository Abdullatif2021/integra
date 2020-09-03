import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DateFormatter} from '@angular/common/src/pipes/deprecated/intl';
import {FileSystemFileEntry} from 'ngx-file-drop';
import {AppConfig} from '../../../config/app.config';

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
  @Output() setAssigned = new EventEmitter();
  @Output() dayAttachmentSelected = new EventEmitter();
  @Output() dayNoteUpdated = new EventEmitter();
  @Output() postmanDayNoteUpdated = new EventEmitter();
  @Output() setNoteAdded = new EventEmitter();

  current_day = 0;
  days = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica'];
  availableUsers = [];

  @ViewChild('editPostmanNoteModal') editPostmanNoteModal ;
  @ViewChild('showMoreAvailablePostmenModal') showMoreAvailablePostmenModal ;
  @ViewChild('editDayNoteModal') editDayNoteModal ;
  @ViewChild('editDayAttachmentModal') editDayAttachmentModal ;
  activepostman = null ;
  activeday = null;
  selected_file = null ;
  displayed_postman = null ;
  formatted_date = '' ;
  monthes = [
      'Gennaio', 'febbraio', 'marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
  ];
  details = null ;
  moreData = [] ;

  current_day_info = {delivered_expanded: false, not_delivered_expanded: false};

  loadMorePage = 1;
  @Input() loadMoreMethods = null ;
  loadMoreSave = null;
  AppConfig = AppConfig;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.data) {
          this.handleDataChanges(changes);
      }
  }

  handleDataChanges(changes) {
      this.current_day = 0;
      this.displayed_postman = null ;
      this.formatted_date = ``;
      if (!this.data) {
          this.data = [
              {skeleton: true}, {skeleton: true}, {skeleton: true}, {skeleton: true}, {skeleton: true},
              {skeleton: true}, {skeleton: true}
          ];
          return;
      }
      if (!this.data.length) {
          return this.data = null ;
      }
      const date = new Date(this.data[0].dayDate.split('/').reverse().join('-'));
      this.formatted_date = `
            ${this.data[0].dayNumber} - ${this.data[this.data.length - 1].dayNumber}
             ${this.monthes[date.getMonth()]} ${date.getFullYear()}
          `.trim();
  }

  openEditPostmanNoteModal(postman, day) {
      this.activepostman = postman ;
      this.activeday = day;
      this.modalService.open(this.editPostmanNoteModal);
  }

  showMore(day, type) {
      if (!this.loadMoreMethods || !this.loadMoreMethods[type] || typeof this.loadMoreMethods[type] !== 'function') {
          return ;
      }
      this.loadMoreSave = {
          day: day,
          type: type
      }
      this.loadMorePage += 1;
      this.moreData = this.moreData.concat([{skeleton: true}, {skeleton: true}, {skeleton: true}, ]);
      this.loadMoreMethods[type](day.dayDate, this.loadMorePage).subscribe(
          data => {
              for (let i = 0; i < 3; ++i) { this.moreData.pop(); }
              this.moreData = this.moreData.concat(data.data);
              console.log(data, this.moreData);
          }
      );
      this.modalService.open(this.showMoreAvailablePostmenModal, {backdrop: 'static', keyboard: false});
  }

  showEvenMore() {
      if (!this.loadMoreSave) {
          return ;
      }
      this.showMore(this.loadMoreSave.day, this.loadMoreSave.type);
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
          this.activeday.file = this.selected_file.relativePath;
          const fileEntry = this.selected_file.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
              this.dayAttachmentSelected.emit({day: this.activeday.dayDate, file: file});
              this.selected_file = null ;
          });
      }
  }

  assignToUser(event) {
      this.setAssigned.emit({sets: [this.details.id], user: event.id});
  }

  changeCurrentDay(step) {
      if ((this.current_day === 0 && step < 0) || (this.current_day >= this.data.length - 1 && step > 0)) {
          return ;
      }
      this.current_day += step;
  }

  addSetNote($event, type) {
      if (!this.displayed_postman || !this.displayed_postman.set_id_for_this_day) {
          return ;
      }
      this.setNoteAdded.emit({
          note: $event,
          type: type,
          set: this.displayed_postman.set_id_for_this_day
      });
  }

  displayedPostman(postman) {
      if (!postman.set_id_for_this_day) {
          this.displayed_postman = null ;
          return this.details = null;
      }
      this.displayed_postman = postman;
      this.details = null ;
      if (typeof this.detailsGetMethod === 'function') {
          this.detailsGetMethod(postman.set_id_for_this_day).subscribe(
              data => {
                  data.data.productsByCategories = Object.keys(data.data.productsByCategories).map(
                      (key) => ({key: key, value: data.data.productsByCategories[key]})
                  );
                  data.data.productsByAddresses = Object.keys(data.data.productsByAddresses).map(
                      (key) => ({key: key, value: data.data.productsByAddresses[key]})
                  );
                  data.data.notDeliveredProducts.groups = Object.keys(data.data.notDeliveredProducts.groups).map (
                      (key) => ({key: key, value: data.data.notDeliveredProducts.groups[key] })
                  );
                  data.data.deliveredProducts.groups = Object.keys(data.data.deliveredProducts.groups).map (
                      (key) => ({key: key, value: data.data.deliveredProducts.groups[key] })
                  );
                  this.details = data.data;
              }
          );
          if (typeof this.availableUsersGetMethod === 'function') {
              this.availableUsersGetMethod(postman.set_id_for_this_day).subscribe(
                  data => {
                      this.availableUsers = data.data;
                  }
              );
          }
      }
  }

  clearSelectedFile() {
      this.selected_file = null;
  }
}
