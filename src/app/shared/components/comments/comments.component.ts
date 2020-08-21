import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() title = '';
  @Input() comments = [];

  constructor() { }

  ngOnInit() {
  }

  addComment(commentInput) {
    if ( !commentInput.value.trim() ) { return ; }
    this.comments.push({
        user: 'Nome Operatore',
        date: '20/08/2020 - 17:00',
        text: commentInput.value.trim()
    });
    commentInput.value = '';
  }

}
