import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() title = '';
  @Input() comments = [];
  @Output() commentAdded = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addComment(commentInput) {
    if ( !commentInput.value.trim() ) { return ; }
    this.comments.push({
        user: 'Nome Operatore',
        created_at: '20/08/2020 - 17:00',
        note: commentInput.value.trim()
    });
    this.commentAdded.emit(commentInput.value.trim());
    commentInput.value = '';
  }

}
