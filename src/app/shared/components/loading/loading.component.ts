import {Component, Input, OnInit} from '@angular/core';
import {LoadingService} from '../../../service/loading.service';
import {LoadingStateInterface} from '../../../core/models/loading-state.interface';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  state: LoadingStateInterface ;

  constructor(
      private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.loadingState.subscribe(
        state => {
          this.state = state ;
        }
    );
  }

  floor(x) {
    return Math.floor(x);
  }

}
