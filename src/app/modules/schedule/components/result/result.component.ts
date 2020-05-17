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
      public dragAndDropService: DragAndDropService,
      private listTreeService: ListTreeService,
      private mapService: MapService,
  ) {
      this.preDispatchData = this.route.snapshot.parent.data.data ;
      this.preDispatch = this.route.snapshot.parent.params.id;
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
  preDispatchData: any;
  page = 1;
  unsubscribe = new EventEmitter();
  postmen = {} ;
  _postmen = {} ;
  selectedPostmen: any = {} ;
  dragging;
  selected_set = {id: -1};
  selectedProducts = [];
  in_selected_drag_mode = false;

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
              this.snotifyService.success('Postino assegnato', { showProgressBar: false, timeout: 1500 });
          },
          error => {
              this.snotifyService.error('Qualcosa è andato storto!!', { showProgressBar: false, timeout: 1500 });
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
          const result = await <any>this.resultsService.getSetGroups(item).catch(
              error => this.snotifyService.error('Qualcosa è andato storto!!', { showProgressBar: false, timeout: 1500 })
          );
          item.children =  result;
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
      item.page = item.page ? ++item.page : 2 ;
      item.loaded = true ;
      const result = await <any>this.resultsService.getSetGroups(item).catch(
          error => this.snotifyService.error('Qualcosa è andato storto!!', { showProgressBar: false, timeout: 1500 })
      );      item.children.pop();
      if (!result.length) {
          return ;
      }
      item.loaded = false ;
      item.children = item.children.concat(result);
  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
  }

  makeDispatchesVisible() {
      this.resultsService.makeDispatchesVisible(this.preDispatch).subscribe(
          data => {
              if (data.success) {
                  this.snotifyService.success('Pre-distinta è stata creata con successo!',  { showProgressBar: false, timeout: 1500 });
              } else {
                  this.snotifyService.error(data.message,  { showProgressBar: false, timeout: 1500 });
              }
          }, error => {
              this.snotifyService.error('Qualcosa è andato storto!!',  { showProgressBar: false, timeout: 1500 });
          }
      );
  }

  selectPostman(postman) {
      if (this.selected_set.id === postman.id) {
          return ;
      }
      this.selected_set = postman ;
      this.loadPath(postman);
  }


  async loadPath(postman, onlyMarkers = false) {
      let markersData = [];
      if (onlyMarkers) {
          const temp = await <any>this.resultsService.getSetMarkers(postman.id).toPromise();
          markersData = temp.data ;
      } else {
          const path = await <any>this.resultsService.getSetPath(postman.id).toPromise();
          markersData = path.data.coordinates ;
          this.mapService.drawPath(JSON.parse(path.data.path));
      }
      this.mapService.reset();
      const markers = <[MapMarker]>[];
      // groups
      markersData.forEach((elm) => {
         const icon = `https://mt.google.com/vt/icon/text=${elm.groups[0].map_priority + 1 + ''}&psize=16&font=fonts/arialuni_t.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1` ;
         let infoWindowText = '';
         elm.groups.forEach(group => {
             group.act_codes.forEach(act_code => {
                 infoWindowText += `[${group.map_priority + 1}] ${act_code} \n`;
             });
         });
         markers.push({
             lat: elm.lat,
             lng: elm.long,
             label: '',
             title: elm.name,
             id: elm.id,
             icon: icon,
             infoWindow: {
                 text: infoWindowText,
                 isOpen: false
             },
             onClick: () => {}
         });
      });
      // add start and end points.
      if (this.preDispatchData.startPoint.lat === this.preDispatchData.endPoint.lat &&
          this.preDispatchData.startPoint.long === this.preDispatchData.endPoint.long ) {
          markers.push({
              lat: this.preDispatchData.startPoint.lat,
              lng: this.preDispatchData.startPoint.long,
              label: 'Start/End',
              title: this.preDispatchData.startPoint.text,
              id: 'start+end+point',
              icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
              infoWindow: false,
              onClick: () => {}
          });
      } else {
          markers.push({
              lat: this.preDispatchData.startPoint.lat,
              lng: this.preDispatchData.startPoint.long,
              label: 'Start',
              title: this.preDispatchData.startPoint.text,
              id: 'start+point',
              icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
              infoWindow: false,
              onClick: () => {}
          });
          markers.push({
              lat: this.preDispatchData.endPoint.lat,
              lng: this.preDispatchData.endPoint.long,
              label: 'End',
              title: this.preDispatchData.startPoint.text,
              id: 'end+point',
              icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
              infoWindow: false,
              onClick: () => {}
          });
      }

      this.mapService.setMarkers(markers);
  }

  getStatusClass(item) {
      if (!item.status) {
          return '' ;
      }
      return 'status-' + item.status ;
  }


  onDragStart(event, item, type = DragAndDropService.DRAGGED_TYPE_ADDRESS) {
      // if type was product, check if dragged item is selected .
      if (type === DragAndDropService.DRAGGED_TYPE_PRODUCT && this.selectedProducts.filter((elm) => elm.id === item.id).length) {
          item = this.selectedProducts ;
          this.in_selected_drag_mode = true ;
      }
      this.dragAndDropService.drag(item, false, type);
  }

  onDragEnd() {
      this.in_selected_drag_mode = false;
  }
  onDrop(event, target) {
      let index = event.index;
      if ( typeof index === 'undefined' ) {
          index = target.children.length;
      }
      if (event.data.item === DragAndDropService.DRAGGED_TYPE_PRODUCT) {
          this.dropProduct(event, target, index);
      } else {
          this.dropAddress(event, target, index) ;
      }

  }

  dropProduct(event, target, index) {
      const list = this.dragAndDropService.drop(index, this.preDispatch);
      if (!list) { return ; }

      // clear selected .
      const trash = [];
      target.children.forEach(address => {
          address.products = address.products.filter((product) => !list.find(i => i === product.id));
          if (address.products.length === 0) {
              trash.push(address.id);
          }
      });
      target.children = target.children.filter(c => !trash.filter(i => i === c.id).length);
      target.children.splice(index, 0, {address: 'loading...', productsCount: list.length, products: []});
      this.resultsService.createNewGroup(this.preDispatch, list, index).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              console.log(data, {
                  id: data.data.id,
                  address: data.data.address[0] ,
                  loaded: false,
                  parent: parent,
                  type: 'building',
                  addressId: data.data.id,
                  products: data.data.products,
                  priority: data.data.mapPriority,
                  productsCount: data.data.products.length
              });
              target.children[index] = {
                  id: data.data.id,
                  address: data.data.address[0] ,
                  loaded: false,
                  parent: parent,
                  type: 'building',
                  addressId: data.data.id,
                  products: data.data.products,
                  priority: data.data.mapPriority,
                  productsCount: data.data.productsCount
              };
          }
      );
  }

  dropAddress(event, target, index) {
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
          this.resultsService.orderTreeNode(result.item.addressId, index).subscribe(
              data => {
                  this.loadPath(this.selected_set, true);
              }
          );
      }
  }

  select(product) {
      product.selected = !product.selected ;
      if (product.selected) {
          this.selectedProducts.push(product);
      } else {
          this.selectedProducts = this.selectedProducts.filter((elm) => elm.id !== product.id);
      }
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      this.scheduleService.showRightSideMap();
  }
}
