import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from '../../../service/loading.service';
import {LoadingStateInterface} from '../../../core/models/loading-state.interface';
import {takeUntil} from 'rxjs/internal/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  state: LoadingStateInterface ;
  visible = true ;
  unsubscribe = new EventEmitter();

  constructor(
      private loadingService: LoadingService,
      private translate: TranslateService
      ) {}

  ngOnInit() {
    this.loadingService.loadingState.pipe(takeUntil(this.unsubscribe)).subscribe(
        state => {
          this.state = state ;
        }
    );
    this.loadingService.visibility.pipe(takeUntil(this.unsubscribe)).subscribe(
        visibility => {
          this.visible = visibility ;
        }
    );
  }

  floor(x) {
    return Math.floor(x);
  }

  hide() {
    this.visible = false;
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
