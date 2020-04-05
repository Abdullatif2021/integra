import {Component, EventEmitter, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResultsService} from '../../service/results.service';
import {takeUntil} from 'rxjs/internal/operators';
import {SnotifyService} from 'ng-snotify';
import {ScheduleService} from '../../service/schedule.service';
import {NotMatchesTreeComponent} from '../../parts-components/not-matches-tree/not-matches-tree.component';
import {DragAndDropService} from '../../../../service/drag-and-drop.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {ListTreeService} from '../../service/list-tree.service';
import {MapService} from '../../service/map.service';
import {forEach} from '@angular/router/src/utils/collection';
import {MapMarker} from '../../../../core/models/map-marker.interface';

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
      private scheduleService: ScheduleService,
      private dragAndDropService: DragAndDropService,
      private listTreeService: ListTreeService,
      private mapService: MapService
  ) {
      this.route.parent.params.subscribe(
          data => {
              this.preDispatch = data.id;
          }
      );
      this.scheduleResults = this.route.snapshot.data.data.scheduleResults;
      this.selectedPostmen = this.route.snapshot.data.data.selectedPostmen;

      this.dragAndDropService.dragged.pipe(takeUntil(this.unsubscribe)).subscribe(
          elm => {
              this.dragging = elm ;
          }
      );
  }

  scheduleResults: any;
  preDispatch: number;
  page = 1;
  unsubscribe = new EventEmitter();
  postmen = {} ;
  _postmen = {} ;
  selectedPostmen: any = {} ;
  dragging;
  selected_set = -1;

  async ngOnInit() {
      this.loadPostmen();
      const results = await this.listTreeService.listNode(this.preDispatch,
          {id: '0', text: '', subtype: '', children: <[TreeNodeInterface]>[], parent: <TreeNodeInterface>{},
              type: 'root', status: 0, page: 0}, 1, null, 'not-matches-tree');
      if (results && results.length) {
          this.scheduleService.changeRightSideView(NotMatchesTreeComponent, results);
      }
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

  selectPostman(postman) {
      this.selected_set = postman.id ;
      this.loadPath(postman);
  }


  async loadPath(postman) {
      const path = await <any>this.resultsService.getSetPath(postman.id).toPromise();
      this.mapService.reset();
      this.mapService.drawPath(JSON.parse(path.data.path));
      const markers = <[MapMarker]>[];
      let i = 1 ;
      path.data.coordinates.forEach((elm) => {
         markers.push({
             lat: elm.lat,
             lng: elm.long,
             label: elm.priority + '',
             title: elm.name,
             id: elm.id,
             infoWindow: {
                 text: elm.act_code,
                 isOpen: false
             },
             onClick: () => {}
         });
         ++i;
      });
      this.mapService.setMarkers(markers);
  }

  getStatusClass(item) {
      if (!item.status) {
          return '' ;
      }
      return 'status-' + item.status ;
  }


  onDragStart(event, item) {
      this.dragAndDropService.drag(item);
  }


  onDrop(event, target) {
      let index = event.index;
      if ( typeof index === 'undefined' ) {
          index = target.children.length;
      }
      const result = this.dragAndDropService.drop(index, target);
      if (result) {
          result.item.marker = this.resultsService.getMarker(result.item.type, result.item.parent);
      }

      if (result.remote) {
          this.resultsService.assignToSet(target.setId, result.item.addressId,
              target.addressId ? target.addressId : target.id, index, result.item.type).subscribe(
              data => {
              }
          );
      } else {
          this.resultsService.orderTreeNode(this.preDispatch, result.item.addressId, index, result.item.type).subscribe(
              data => {
              }
          );
      }

  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      this.scheduleService.showRightSideMap();
  }
}
