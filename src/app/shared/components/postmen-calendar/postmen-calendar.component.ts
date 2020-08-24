import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-postmen-calendar',
  templateUrl: './postmen-calendar.component.html',
  styleUrls: ['./postmen-calendar.component.css']
})
export class PostmenCalendarComponent implements OnInit {

  @Input() data ;
  @Input() view = 'week';
  current_day = 0;
  days = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica']


  @ViewChild('editPostmanNoteModal') editPostmanNoteModal ;
  @ViewChild('editDayNoteModal') editDayNoteModal ;
  @ViewChild('editDayAttachmentModal') editDayAttachmentModal ;
  activepostman = null ;
  activeday = null;
  selected_file = null ;
  displayed_postman = null ;

  current_day_info = {delivered_expanded: false, not_delivered_expanded: false};
  constructor(private modelService: NgbModal) { }

  ngOnInit() {
  }


  openEditPostmanNoteModal(postman) {
      this.activepostman = postman ;
      this.modelService.open(this.editPostmanNoteModal);
  }

  savePostmanNote(input) {
      this.activepostman.note = input.value ;
  }

  openEditDayNoteModal(day, idx) {
      day._idx = idx ;
      this.activeday = day ;
      this.modelService.open(this.editDayNoteModal);
  }

  saveDayNote(input) {
      this.activeday.note = input.value ;
      console.log(this.activeday);
  }

  openEditDayAttachmentModal(day, idx) {
      day._idx = idx ;
      this.activeday = day ;
      this.modelService.open(this.editDayAttachmentModal, {backdrop: 'static', keyboard: false});
  }

  fileSelected(event) {
      if (event.length) {
          this.selected_file = event[0];
      }
  }

  saveDayAttachment() {
      if (this.selected_file) {
          this.activeday.attachment = this.selected_file.relativePath;
          this.selected_file = null ;
      }
  }

  changeCurrentDay(step) {
      if ((this.current_day === 0 && step < 0) || (this.current_day >= 6 && step > 0)){
          return ;
      }
      this.current_day += step;
  }

  displayedPostman(postman) {
      this.displayed_postman = postman;
  }

  clearSelectedFile() {
      this.selected_file = null;
  }
}
