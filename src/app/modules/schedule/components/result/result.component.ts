import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResultsService} from '../../service/results.service';
import {takeUntil} from 'rxjs/internal/operators';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {

  constructor(
      private route: ActivatedRoute,
      private resultsService: ResultsService,
      private snotifyService: SnotifyService,
  ) {
      this.route.parent.params.subscribe(
          data => {
              this.preDispatch = data.id;
          }
      );
      this.scheduleResults = this.route.snapshot.data.data.scheduleResults;
      this.selectedPostmen = this.route.snapshot.data.data.selectedPostmen;
  }

  scheduleResults: any;
  preDispatch: number;
  page = 1;
  unsubscribe = new EventEmitter();
  postmen = {} ;
  _postmen = {} ;
  selectedPostmen: any = {} ;

  ngOnInit() {
      this.loadPostmen();
  }

  async assignPostman(event, set, day) {
      this.resultsService.assignPostman(event.id, set.id).subscribe(
          data => {
              this.snotifyService.success('Postman Assigned', { showProgressBar: false, timeout: 1500 });
          },
          error => {
              this.snotifyService.error('Something went wrong', { showProgressBar: false, timeout: 1500 });
          }
      );
      this.filterPostmen(day) ;
  }

  filterPostmen(day) {
      this.postmen[day.day] = this._postmen[day.day].filter((elm) => {
          return !Object.values(this.selectedPostmen[day.day]).find(e => e &&  e['id'] === elm.id);
      });
  }

  loadPostmen() {
      this.resultsService.getPostmenByPreDispatch(this.preDispatch).subscribe(
          data => {
              data.data.forEach((elm) => {
                  Object.keys(elm).forEach((day) => {
                      this._postmen[day] = elm[day];
                      this.postmen[day] = elm[day];
                      this.filterPostmen({day: day});
                  });
              });
          },
      );
  }

  async expand(item) {
      item.expanded = !item.expanded;
      if (!item.type) { return ; }
      if (item.expanded && !item.children.length) {
          item.children = [{skeleton: true}];
          item.loaded = true ;
          item.children = await this.resultsService.listNode(item) ;
          item.loaded = false ;
      }
  }

  async loadMore(item) {
      if (item.loaded) {
          return ;
      }
      if (!item.children) {
          item.children = [] ;
      }
      item.children.push({skeleton: true});
      if (!item.page) {
          item.page = 2 ;
      } else {
          item.page ++ ;
      }
      item.loaded = true ;
      const data = await this.resultsService.listNode(item);
      item.children.pop();
      if (!data || !data.length) {
          return ;
      }
      item.loaded = false ;
      item.children = item.children.concat(data);
  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
  }
  getLvl(next) {
      return (next + '').split(':').length;
  }

  makeDispatchesVisible() {
      this.resultsService.makeDispatchesVisible(this.preDispatch).subscribe(
          data => {
              if (data.success) {
                  this.snotifyService.success('Dispatches was created !',  { showProgressBar: false, timeout: 1500 });
              } else {
                  this.snotifyService.error(data.message,  { showProgressBar: false, timeout: 1500 });
              }
          }, error => {
              this.snotifyService.error('Something went wrong',  { showProgressBar: false, timeout: 1500 });
          }
      );
  }

  getStatusClass(item) {
      if (!item.status) {
          return '' ;
      }
      return 'status-' + item.status ;
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
