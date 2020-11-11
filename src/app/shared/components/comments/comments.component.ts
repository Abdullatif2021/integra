import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfig} from '../../../config/app.config';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() title = '';
  @Input() comments = [];
  @Input() file = false;
  @Output() commentAdded = new EventEmitter();
  selected_file = null ;
  AppConfig  = AppConfig;
  constructor() { }

  ngOnInit() {
  }

  addComment(commentInput) {
    if ( !commentInput.value.trim() ) { return ; }
    // this.comments.push({
    //     user: 'Nome Operatore',
    //     created_at: '20/08/2020 - 17:00',
    //     note: commentInput.value.trim()
    // });
    this.commentAdded.emit({text: commentInput.value.trim(), file: this.selected_file});
    commentInput.value = '';
  }

  setFile(event) {
    this.selected_file = event.target.files ? event.target.files[0] : null;
  }

}
