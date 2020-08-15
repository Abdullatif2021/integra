import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-postmen-calendar',
  templateUrl: './postmen-calendar.component.html',
  styleUrls: ['./postmen-calendar.component.css']
})
export class PostmenCalendarComponent implements OnInit {

  @Input() data ;

  days = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica']


  @ViewChild('editPostmanNoteModal') editPostmanNoteModal ;
  @ViewChild('editDayNoteModal') editDayNoteModal ;
  @ViewChild('editDayAttachmentModal') editDayAttachmentModal ;
  activepostman = null ;
  activeday = null;
  selected_file = null ;
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

  clearSelectedFile() {
      this.selected_file = null;
  }
}
