import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResultsService} from '../../service/results.service';
import {takeUntil} from 'rxjs/internal/operators';
import {SnotifyService} from 'ng-snotify';
import {ScheduleService} from '../../service/schedule.service';
import {NotMatchesTreeComponent} from '../../parts-components/not-matches-tree/not-matches-tree.component';
import {DragAndDropService} from '../../../../service/drag-and-drop.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {ListTreeService} from '../../service/list-tree.service';
import {MapService} from '../../../../service/map.service';
import {MapMarker} from '../../../../core/models/map-marker.interface';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotFixedTreeComponent} from '../../parts-components/not-fixed-tree/not-fixed-tree.component';
import {BackProcessingService} from '../../../../service/back-processing.service';
import { TranslateService } from '@ngx-translate/core';

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
      protected preDispatchService: PreDispatchService,
      private modalService: NgbModal,
      private backProcessingService: BackProcessingService,
      private translate: TranslateService,
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

  selected = [];
  scheduleResults: any;
  all_selected = false;
  scheduleResultsDisplayedTab = 'not_assigned';
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
  toBeMoved = [];
  toBeMovedTo = '';
  notFixedProductsTableShown = false ;
  @ViewChild('ConfirmMoveToModal') confirmMoveToModal: ElementRef;
  notFixedCount = [];
  movedNotFixedStorage = [];
  selected_sets = [];
  errors = {sets: {}};
  async ngOnInit() {
      this.loadPostmen();
      const results = await this.listTreeService.listNode(this.preDispatch,
          {id: '0', text: '', subtype: '', children: <[TreeNodeInterface]>[], parent: <TreeNodeInterface>{},
              type: 'root', status: 0, page: 0}, 1, null, 'not-matches-tree');
      if (results && results.length) {
          this.scheduleService.changeRightSideView(NotMatchesTreeComponent, results);
      }
      this.preDispatchService.resultsMoveToButtonClicked.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => { this.moveSelectedTo(data); }
      );
      this.scheduleService.preDispatchDataChanged.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.preDispatchData = data ;
              if ((!results || !results.length) && this.preDispatchData.has_not_fixed_products && !this.notFixedProductsTableShown) {
                  this.notFixedProductsTableShown = true ;
                  this.scheduleService.changeRightSideView(NotFixedTreeComponent, results);
              }
          }
      );
  }

  async assignPostman(event, set, day) {
      if (this.notFixedProductsTableShown) {
          return ;
      }
      this.resultsService.assignPostman(event.id, set.id).subscribe(
          data => {
              if (
                  this.scheduleResultsDisplayedTab === 'not_assigned' && event.id !== null ||
                  (this.scheduleResultsDisplayedTab === 'assigned' && event.id === null)
              ) {
                  // filter all days according to assigned sets got from the response.
                  this.scheduleResults.forEach(_day => {
                      _day.sets = _day.sets.filter(i => data.data.indexOf(i.id) === -1);
                      if (!_day.sets || !_day.sets.length) {
                          this.scheduleResults = this.scheduleResults.filter(i => i.day !== _day.day);
                      }
                  });
              } else if (this.scheduleResultsDisplayedTab === 'assigned' && event.id !== null) {
                  // if the active tab was assigned and the user changed a set postman,
                  // and server returned that other sets should change too, change the postman on the other sets
                  this.scheduleResults.forEach(_day => {
                      _day.sets.forEach(_set => {
                          if (data.data.indexOf(_set.id) !== -1) {
                              console.log('index of', _set.id, data.data);
                              this.selectedPostmen[_day.day][_set.id] = event;
                          }
                      });
                  });
              }
              this.snotifyService.success(this.translate.instant('schedule.result.scheduleResults.success'),
               { showProgressBar: false, timeout: 1500 });
          },
          error => {
              this.snotifyService.error(this.translate.instant('schedule.result.scheduleResults.error'),
               { showProgressBar: false, timeout: 1500 });
          }
      );
      this.filterPostmen(day) ;
  }

  filterPostmen(day) {
      if (!this.selectedPostmen[day.day]) {
          return this.postmen[day.day] = this._postmen[day.day];
      }
      this.postmen[day.day] = this._postmen[day.day].filter((elm) => {
          return !Object.values(this.selectedPostmen[day.day]).find(e => e &&  e['id'] === elm.id && e['id']);
      });
  }

  loadPostmen() {
      this._postmen = {} ;
      this.postmen = {} ;
      this.resultsService.getPostmenByPreDispatch(this.preDispatch).subscribe(
          data => {
              data.data.forEach((elm) => {
                  Object.keys(elm).forEach((day) => {
                      this._postmen[day] = [{full_name: 'None', id: null}].concat(elm[day]);
                      this.postmen[day] = [{full_name: 'None', id: null}].concat(elm[day]);
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
              error => this.snotifyService.error(this.translate.instant('schedule.result.scheduleResults.error'),
               { showProgressBar: false, timeout: 1500 })
          );
          item.children =  result;
          item.loaded = false ;
          this.updateItemsMarkers(item);
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
          error => this.snotifyService.error(this.translate.instant('schedule.result.scheduleResults.error'),
           { showProgressBar: false, timeout: 1500 })
      );
      item.children.pop();
      if (!result.length) {
          return ;
      }
      item.loaded = false ;
      item.children = item.children.concat(result);
      this.updateItemsMarkers(item);
  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
  }

  collectSelectedSets() {
      const sets = [] ;
      this.selected.forEach(item => {
          if ( item._type === 'set' && !item.is_distenta_created) { sets.push({id: item.id, name: item.name}); }
      });
      return sets ;
  }

  makeDispatchesVisible() {

      this.selected_sets = this.collectSelectedSets();

      if (!this.selected_sets.length) {
          return this.snotifyService.warning(this.translate.instant('schedule.result.makeDispatchesVisible.warning'),
           { showProgressBar: false, timeout: 1500 });
      }

      this.errors.sets = {};
      this.selected_sets.forEach(set => {
          if (!set.name) {
              this.errors.sets[set.id] = 1;
          }
      });

      if (Object.keys(this.errors.sets).length) {
          return this.snotifyService.warning(this.translate.instant('schedule.result.makeDispatchesVisible.warning2'),
           {showProgressBar: false});
      }
      this.resultsService.makeDispatchesVisible(this.preDispatch, this.selected_sets).subscribe(
          data => {
              if (data.success) {
                  this.snotifyService.success(this.translate.instant('schedule.result.makeDispatchesVisible.success'),
                    { showProgressBar: false, timeout: 1500 });
                  this.selected.forEach(item => {
                      if ( item._type === 'set' ) { item.is_distenta_created = true; item.parent.sets_that_are_not_distintas--; }
                  });
                  this.selected = [] ;
                  this.selected_sets = [];
                  this.all_selected = false ;
              } else {
                  if (data.statusCode === 510) {
                      window.parent.postMessage({runPreDispatch: this.preDispatchData, data: {
                          ignoreDivide: false,
                          force_run: 'planning'
                      }}, '*');
                  } else {
                      this.snotifyService.error(data.message,  { showProgressBar: false, timeout: 1500 });
                  }
              }
          }, error => {
              this.snotifyService.error(this.translate.instant('schedule.result.makeDispatchesVisible.error'),
               { showProgressBar: false, timeout: 1500 });
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
          markersData = temp.data.data ;
      } else {
          const path = await <any>this.resultsService.getSetPath(postman.id).toPromise();
          markersData = path.data.coordinates ;
          this.mapService.drawPath(JSON.parse(path.data.path));
      }
      this.mapService.reset();
      const markers = <[MapMarker]>[];
      // groups
      markersData.forEach((elm) => {
         const priority = (elm.groups ? elm.groups[0].map_priority : elm.priority) + 1 + '' ;
         const icon = `https://mt.google.com/vt/icon/text=${priority}&psize=16&font=fonts/arialuni_t.ttf&color=ff330000` +
         `&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1` ;
         let infoWindowText = `<table class="table"><thead><tr><th class="text-center">Order</th>
                                    <th scope="col" class="text-center">Destinatario</th><th class="text-center">Codice Atto</th>
                                    <th class="text-center">Prodotto</th><th class="text-center">Codice a Barre</th></tr>`;
         elm.groups.forEach(group => {
             group.products.forEach(product => {
                 infoWindowText += `<tr><th class="text-center">${product.priority + 1}</th>
                                        <td class="text-center">${product.recipient.name}</td>
                                        <td class="text-center">${product.act_code}</td>
                                        <td class="text-center">${product.integra_name.name}</td
                                        ><td class="text-center">${product.barcode}</td></tr>`;
             });
         });
         infoWindowText += `</tbody></table>`;
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
              label: this.translate.instant('schedule.result.add_start_and_end_points.start_end'),
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
              label: this.translate.instant('schedule.result.makeDispatchesVisible.start'),
              title: this.preDispatchData.startPoint.text,
              id: 'start+point',
              icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
              infoWindow: false,
              onClick: () => {}
          });
          markers.push({
              lat: this.preDispatchData.endPoint.lat,
              lng: this.preDispatchData.endPoint.long,
              label: this.translate.instant('schedule.result.makeDispatchesVisible.end'),
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
      if (this.dragAndDropService.getDraggedElementType() === DragAndDropService.DRAGGED_TYPE_PRODUCT) {
          this.dropProduct(event, target, index);
      } else if (
          this.dragAndDropService.getDraggedElementType() === DragAndDropService.DRAGGED_TYPE_NOT_FIXED ||
          this.dragAndDropService.drag_elm._hint === 'not_fixed' /* if item was moved to fixed but was not saved yet */
      ) {
          this.dropNotFixed(event, target, index) ;
      } else {
          if (target.id !== this.dragAndDropService.drag_elm.parent.id) {
              return ;
          }
          this.dropAddress(event, target, index) ;
      }

  }

  async dropNotFixed(event, target, index) {
        this.dragAndDropService.drop(index, target);
        const elmements = this.dragAndDropService.drag_elm ;
        elmements.forEach(single => {
            if (single.parent) {
                console.log('here we go');
                single.parent.children = single.parent.children.filter( ix => ix.id !== single.id );
            }
            single.selected = false ;
            single.fromNotFixed = true ;
            single._hint = 'not_fixed' ;
            single.parent = target;
            target.quantity += single.productsCount;
            target.children.splice(index, 0, single);
            this.movedNotFixedStorage = this.movedNotFixedStorage.filter(ix => ix.id !== single.id);
            this.movedNotFixedStorage.push({id: single.id, set: target.id, index: index});
        });
        this.updateItemsMarkers(target);
        this.backProcessingService.blockExit(this.translate.instant('schedule.result.updateItemsMarkers'));
    }

  updateItemsMarkers(set) {
      let marker = 0 ;
      for (let i = 0; i < set.children.length; ++i) {
          if (!set.children[i].fromNotFixed) {
              set.children[i]._marker = ++marker;
          } else { set.children[i]._marker = 'NA' ; }
      }
  }

  async saveMovedNotFixed() {
      const save = this.movedNotFixedStorage ;
      this.movedNotFixedStorage = [];
      const result = await this.resultsService.moveNotFixesGroupToSet(save).toPromise().catch( e => {});
      if (!result || !result.success) {
          this.backProcessingService.unblockExit();
          // remove the new Item
          this.movedNotFixedStorage = this.movedNotFixedStorage.concat(save);
          this.snotifyService.error(this.translate.instant('schedule.result.saveMovedNotFixed.error'),
           { showProgressBar: false, timeout: 1500 });
      } else {
          if (this.dragAndDropService.readyToShowMap) {
              this.notFixedProductsTableShown = false ;
              this.scheduleService.showRightSideMap();
          }
          this.backProcessingService.unblockExit();
          this.snotifyService.success(this.translate.instant('schedule.result.saveMovedNotFixed.success'),
           { showProgressBar: false, timeout: 1500 });
          this.changeActiveFilteringTab(this.scheduleResultsDisplayedTab);
      }
  }

  dropProduct(event, target, index) {
      const result = this.dragAndDropService.drop(index, this.preDispatch);


      const list = result.list;
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

      if (Array.isArray(result.items)) {
          result.items.forEach(item => {
              item.parent.productsCount--;
          });
      } else {
          result.items.parent.productsCount--;
      }

      this.resultsService.createNewGroup(this.preDispatch, list, index).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
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
      if (result.fromNotFixed) {
          return ;
      }
      if (result.remote) {
          this.resultsService.assignToSet(target.setId, result.item.addressId,
              target.addressId ? target.addressId : target.id, index, result.item.type).subscribe(
              data => { this.updateItemsMarkers(target); }
          );
      } else {
          console.log('here we go');
          this.resultsService.orderTreeNode(result.item.addressId, index, target.id).subscribe(
              data => {
                  this.updateItemsMarkers(target);
                  this.loadPath(this.selected_set, true);
              }
          );
      }
  }

  async changeActiveFilteringTab(type) {
    this.scheduleResultsDisplayedTab = type ;
    this.scheduleResults = null ; // show the skeleton loading.
    this.selected = [];
    this.all_selected = false;
    this.notFixedCount = [];
    this.scheduleResults = await <any>this.resultsService.getScheduleResults(this.preDispatch, type).catch(e => {});
    this.scheduleResults.forEach((day) => {
        day.sets_that_are_not_distintas = 0 ;
        day.sets.forEach((set) => {
            if (!this.selectedPostmen[day.day]) {
                this.selectedPostmen[day.day] = <any>{} ;
            }
            this.selectedPostmen[day.day][set.id] = set.postman ;
            if (!set.is_distenta_created) {
                day.sets_that_are_not_distintas++;
            }
        });
    });
    this.loadPostmen();
  }

  select(item, type, event) {
      event.preventDefault();
      event.stopPropagation();
      if (type === 'day') {
          // select all sets in day
          item.selected = !item.selected;
          return this.selectDay(item, item.selected);
      }
      if (type === 'all') {
          this.all_selected = !this.all_selected;
          this.scheduleResults.forEach(day => {
              day.selected = this.all_selected;
              this.selectDay(day, day.selected);
          });
      }
      if (type === 'product') {
          this.selectProduct(item);
      }
      if (type === 'set' && item.is_distenta_created) {
          return ;
      }
      item.selected = !item.selected ;
      item._type = type ;
      if (item.selected) {
          this.selected.push(item);
      } else {
          this.selected = this.selected.filter((elm) => elm.id !== item.id);
      }
      this.selected_sets = this.collectSelectedSets();
  }

  selectDay(item, select = false) {
      item.sets.forEach(set => {
          if (select) {
              set.selected = true ;
              this.selected = this.selected.filter((elm) => elm.id !== set.id);
              this.selected.push(set);
          } else {
              set.selected = false ;
              this.selected = this.selected.filter((elm) => elm.id !== set.id);
          }
      });
      this.selected_sets = this.collectSelectedSets();
  }

  selectProduct(product: any) {
      if (product.selected) {
          this.selectedProducts.push(product);
      } else {
          this.selectedProducts = this.selectedProducts.filter((elm) => elm.id !== product.id);
      }
  }

  moveSelectedTo(to) {

      if (!this.selected.length) {
          return this.snotifyService.warning(this.translate.instant('schedule.result.moveSelectedTo.warning'),
           { showProgressBar: false, timeout: 1500 });
      }
      if (this.scheduleResultsDisplayedTab === 'assigned') {
          return this.snotifyService.warning(this.translate.instant('schedule.result.moveSelectedTo.warning2'),
           { showProgressBar: false, timeout: 1500 });
      }

      let warning = false ;
      const list = [];
      // do the checking if any thing needs to be re-planned, while clearing data
      this.selected.forEach(item => {
          if (item._type === 'set') { list.push(item); }
          if (item._type === 'group') {
              if (!this.selected.find(i => i.id === item.parent.id && i._type === 'set')) {
                  warning = true ;
                  list.push(item);
              }
          } else if (item._type === 'product') {
              const setParent = this.selected.find(i => i.id === item.parent.parent.id && i._type === 'set') ;
              if (!setParent) {
                  warning = true ;
              }
              const groupParent = this.selected.find(i => i.id === item.parent.id && i._type === 'group') ;
              if (!setParent && !groupParent) {
                  list.push(item);
              }
          }
      });

      this.toBeMoved = list ;
      this.toBeMovedTo = to ;
      if (warning) {
          // show the confirm modal
          this.modalService.open(this.confirmMoveToModal);
      } else {
          this.sendMoveToRequest();
      }
  }

  async sendMoveToRequest() {
      const data = await this.resultsService.moveResultsTo(this.toBeMovedTo, this.toBeMoved, this.preDispatch).toPromise().catch(e => {
          this.snotifyService.error(this.translate.instant('schedule.result.sendMoveToRequest.error'),
           { showProgressBar: false, timeout: 1500 });
      });
      if (!data) { return ; }

      this.selected.forEach(item => {
          if (item._type === 'set') {
              if (!this.scheduleResults) { return ; }
              this.scheduleResults.forEach(day => {
                  day.sets = day.sets.filter(_set => _set.id !== item.id);
                  if (!day.sets.length) {
                      this.scheduleResults = this.scheduleResults.filter(ix => ix.day === day.day);
                  }
              });
          } else {
              item.parent[item._type === 'group' ? 'children' : 'products'] =
                  item.parent[item._type === 'group' ? 'children' : 'products'].filter(i => item.id !== i.id);
          }
      });
      this.selected = [] ;
      return this.snotifyService.success(this.translate.instant('schedule.result.sendMoveToRequest.success'),
       { showProgressBar: false, timeout: 1500 });
  }

  changeDispatchName(event, item) {
      item.name = event.target.value.trim();
      if (item.name) {
          this.errors.sets[item.id] = false;
      }
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      this.scheduleService.showRightSideMap();
  }
}
