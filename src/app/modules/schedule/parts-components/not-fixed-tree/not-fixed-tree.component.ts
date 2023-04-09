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
  selected = [];


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
            console.log('here', _d);
            if (!_d.fromNotFixed) { return ; }
            this.list = this.list.filter(i => !_d.item.map(j => j.id).includes(i.id));
            this.selected = this.selected.filter(i => !_d.item.map(j => j.id).includes(i.id));
            console.log(this.list.length, _d.item, this.list);
            this.dragAndDropService.setReadyToShowMap(this.list.length ? false : true);
            if (this.list.length < 20 && !this.allLoaded) {
              this.loadMore();
            }
        }
     );
  }


  selectAll() {
      if (this.selected.length === this.list.length) {
          this.selected = [];
          this.list.forEach(item => item.selected = false );
      } else {
          this.selected = [...this.list];
          this.list.forEach(item => item.selected = true );
      }
  }

  onDrop(event, item) {
    console.log('dropped');
  }

  onDragStart(event, item) {
      if (this.selected.filter(i => i.id === item.id).length) {
          this.dragAndDropService.drag(this.selected, true, DragAndDropService.DRAGGED_TYPE_NOT_FIXED);
      } else {
          this.dragAndDropService.drag([item], true, DragAndDropService.DRAGGED_TYPE_NOT_FIXED);
      }
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

  select(item) {
      item.selected = !item.selected ;
      if (item.selected) {
          this.selected.push(item) ;
      } else {
          this.selected = this.selected.filter(i => i.id !== item.id);
      }
      console.log(this.selected);
  }

  // Life Cycle OnDestroy

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
