import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ResultsService} from '../../service/results.service';
import {SnotifyService} from 'ng-snotify';
import {ActivatedRoute} from '@angular/router';
import {DragAndDropService} from '../../../../service/drag-and-drop.service';
import {takeUntil} from 'rxjs/internal/operators';
import {ScheduleService} from '../../service/schedule.service';

@Component({
  selector: 'app-not-fixed-tree',
  templateUrl: './not-fixed-tree.component.html',
  styleUrls: ['./not-fixed-tree.component.css']
})
export class NotFixedTreeComponent implements OnInit, OnDestroy {

  constructor(
      private resultsService: ResultsService,
      private snotifyService: SnotifyService,
      private route: ActivatedRoute,
      private dragAndDropService: DragAndDropService,
      private scheduleService: ScheduleService
  ) { }

  list = [];
  preDispatch;
  preDispatchData;
  allLoaded = false ;
  loading = false ;
  page = 1;
  unsubscribe = new EventEmitter();


  async ngOnInit() {
    this.preDispatch = this.route.snapshot.params.id;
    this.preDispatchData = this.route.snapshot.data.data ;
    const data = await this.resultsService.getNotFixedItems(this.preDispatch).toPromise().catch(e => {
      this.snotifyService.error('Qualcosa andato storto', { showProgressBar: false, timeout: 1500 });
    });
    if (data && data.data) {
      this.list = data.data ;
      this.snotifyService.warning('Alcuni prodotti doveno trascianti manualmente alle distinte', { showProgressBar: false, timeout: 1500 });
    }
    this.dragAndDropService.dropped.pipe(takeUntil(this.unsubscribe)).subscribe(
        (_d: any) => {
            if (!_d.fromNotFixed) { return ; }
            this.list = this.list.filter( i => i.id !== _d.item.id);
            if (!this.list.length) {
                this.scheduleService.showRightSideMap();
            } else if (this.list.length < 20 && !this.allLoaded) {
              this.loadMore();
            }
        }
     );
  }

  onDrop(event, item) {
    console.log('dropped');
  }

  onDragStart(event, item) {
      this.dragAndDropService.drag(item, true, DragAndDropService.DRAGGED_TYPE_NOT_FIXED);
  }

  async loadMore() {
      if (this.loading) { return ;}
      this.page++;
      this.loading = true ;
      this.list.push({skeleton: true});
      const data = await this.resultsService.getNotFixedItems(this.preDispatch, this.page).toPromise().catch(e => {
          this.snotifyService.error('Qualcosa andato storto', { showProgressBar: false, timeout: 1500 });
      });
      this.list.pop();
      this.loading = false ;
      if (data && data.data && data.data.length) {
        this.list = this.list.concat(data.data) ;
      } else if (data && (!data.data || !data.data.length)) {
        this.allLoaded = true ;
      }
  }


  // Life Cycle OnDestroy

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
