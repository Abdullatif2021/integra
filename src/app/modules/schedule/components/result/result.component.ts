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
import {MapService} from '../../service/map.service';
import {MapMarker} from '../../../../core/models/map-marker.interface';
import {forEach} from '@angular/router/src/utils/collection';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotFixedTreeComponent} from '../../parts-components/not-fixed-tree/not-fixed-tree.component';
import {BackProcessingService} from '../../../../service/back-processing.service';

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
      private backProcessingService: BackProcessingService
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
      this.resultsService.assignPostman(event.id, set.id).subscribe(
          data => {
              if (
                  this.scheduleResultsDisplayedTab === 'not_assigned' && event.id !== null ||
                  (this.scheduleResultsDisplayedTab === 'assigned' && event.id === null)
              ) {
                  day.sets = day.sets.filter(i => i.id !== set.id);
                  if (!day.sets || !day.sets.length) {
                      this.scheduleResults = this.scheduleResults.filter(i => i.day !== day.day);
                  }
              }
              this.snotifyService.success('Postino assegnato', { showProgressBar: false, timeout: 1500 });
          },
          error => {
              this.snotifyService.error('Qualcosa è andato storto!!', { showProgressBar: false, timeout: 1500 });
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
      const sets = [] ;
      this.selected.forEach(item => {
          if ( item._type === 'set' ) { sets.push(item.id); }
      });
      if (!sets.length) {
          return this.snotifyService.warning('Nessuna distinta selezionata', { showProgressBar: false, timeout: 1500 });
      }
      this.resultsService.makeDispatchesVisible(this.preDispatch, sets).subscribe(
          data => {
              if (data.success) {
                  this.snotifyService.success('Pre-distinta è stata creata con successo!',  { showProgressBar: false, timeout: 1500 });
                  this.selected.forEach(item => {
                      if ( item._type === 'set' ) { item.is_distenta_created = true; }
                  });
                  this.selected = [] ;
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
                                    <th scope="col" class="text-center">Recipient</th><th class="text-center">Act code</th>
                                    <th class="text-center">Product</th><th class="text-center">Barcode</th></tr></thead><tbody>`;
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
      const elm = this.dragAndDropService.drag_elm ;
      console.log(elm);
      if (elm.parent) {
          elm.parent.children = elm.parent.children.filter( ix => ix.id !== elm.id );
      }

      elm.fromNotFixed = true ;
      elm._hint = 'not_fixed' ;
      elm.parent = target;
      target.children.splice(index, 0, elm);

      let nfixedcount = 0;
      let i = 0;
      // update not fixed count
      target.children.forEach(child => {
          if (child.fromNotFixed) { nfixedcount++ ; }
          this.notFixedCount[i] = nfixedcount;
          i++;
      });
      this.backProcessingService.blockExit('Some Items was not saved, are you sure you want to exit');
      this.movedNotFixedStorage = this.movedNotFixedStorage.filter(ix => ix.id !== elm.id);
      this.movedNotFixedStorage.push({id: elm.id, set: target.id, index: index});
  }

  async saveMovedNotFixed() {
      const save = this.movedNotFixedStorage ;
      this.movedNotFixedStorage = [];
      const result = await this.resultsService.moveNotFixesGroupToSet(save).toPromise().catch( e => {});
      if (!result || !result.success) {
          this.backProcessingService.unblockExit();
          // remove the new Item
          this.movedNotFixedStorage = this.movedNotFixedStorage.concat(save);
          this.snotifyService.error('Qualcosa è andato storto spostando il prodotto', { showProgressBar: false, timeout: 1500 });
      } else {
          this.backProcessingService.unblockExit();
          this.snotifyService.success('Prodotti spostati con successo', { showProgressBar: false, timeout: 1500 });
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

  async changeActiveFilteringTab(type) {
    this.scheduleResultsDisplayedTab = type ;
    this.scheduleResults = null ; // show the skeleton loading.
    this.scheduleResults = await <any>this.resultsService.getScheduleResults(this.preDispatch, type).catch(e => {});
    this.scheduleResults.forEach((day) => {
        day.sets.forEach((set) => {
            if (!this.selectedPostmen[day.day]) {
                this.selectedPostmen[day.day] = <any>{} ;
            }
            this.selectedPostmen[day.day][set.id] = set.postman ;
        });
    });
    this.loadPostmen();
  }

  select(item, type, event) {
      event.preventDefault();
      event.stopPropagation();
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
          return this.snotifyService.warning('Nessun prodotto selezionato', { showProgressBar: false, timeout: 1500 });
      }
      if (this.scheduleResultsDisplayedTab === 'assigned') {
          return this.snotifyService.warning('Non puoi spostare prodotti assegnati', { showProgressBar: false, timeout: 1500 });
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
          this.snotifyService.error('Impossibile spostare i prodotti', { showProgressBar: false, timeout: 1500 });
      });
      if (!data) { return ; }

      this.selected.forEach(item => {
          if (item._type === 'set') {
              if (!this.scheduleResults) { return ; }
              this.scheduleResults.forEach(day => {
                  day.sets = day.sets.filter(_set => _set.id !== item.id);
              });
          } else {
              item.parent[item._type === 'group' ? 'children' : 'products'] =
                  item.parent[item._type === 'group' ? 'children' : 'products'].filter(i => item.id !== i.id);
          }
      });
      this.selected = [] ;
      return this.snotifyService.success('Dati spostati correttamente', { showProgressBar: false, timeout: 1500 });
  }


  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      this.scheduleService.showRightSideMap();
  }
}
