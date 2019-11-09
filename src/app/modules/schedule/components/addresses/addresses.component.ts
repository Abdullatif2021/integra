import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListTreeService} from '../../service/list-tree.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {LocatingService} from '../../service/locating.service';
import {takeUntil} from 'rxjs/internal/operators';
import {SettingsService} from '../../../../service/settings.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressesActionsService} from '../../service/addresses.actions.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit, OnDestroy {

  preDispatch: number ;
  unsubscribe = new EventEmitter();

  constructor(
      private route: ActivatedRoute,
      private listTreeService: ListTreeService,
      private locatingService: LocatingService,
      private settingsService: SettingsService,
      private modalService: NgbModal,
      private addressesActionsService: AddressesActionsService,
      private snotifyService: SnotifyService,
  ) {
      this.preDispatch = this.route.snapshot.params.id;
  }

// { id: 1, selected: true, marker: 'A', name: 'Bologna', warning: true, qta: 14, children: [], status: 1}

  tree = <TreeNodeInterface[]>[
      // The root node of the tree .
      {id: '0', text: '', subtype: '', children: [], parent: <TreeNodeInterface>{}, type: 'root', status: 0}
  ] ;
  pages = {} ;
  loading = {} ;
  paginationOptions: any ;
  expanded = {} ;
  dragging: TreeNodeInterface ;
  move_to_items = [];
  all_start_points = [];
  all_end_points = [];
  toMoveItem: any;
  @ViewChild('startPointTextInput') startPointTextInput: ElementRef;
  @ViewChild('endPointTextInput') endPointTextInput: ElementRef;


    async ngOnInit() {
      this.locatingService.treeCreated.pipe(takeUntil(this.unsubscribe)).subscribe(
          async data => {
              this.pages = {} ;
              this.loading = {};
              this.expanded = [];
              this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0]) ;
          }
      );
      this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0]) ;
      this.settingsService.getPaginationOptions().pipe(takeUntil(this.unsubscribe)).subscribe(
          data => { if (data.statusCode === 200) { this.paginationOptions = data.data; console.log(this.paginationOptions); } },
          error => { console.log(error); }
      );
  }

  async listNode(node, next) {
    if (!this.expanded[next] && !node.children.length) {
      await this.load(node, next) ;
    }
    this.expanded[next] = !this.expanded[next] ;
  }

  async load(node, next) {
      if (this.loading[next]) {
          return ;
      }
      this.loading[next] = true ;
      node.children.push({skeleton: true}) ;
      this.listTreeService.listNode(this.preDispatch, node, this.pages[next]).then(
          data => {
              node.children.pop();
              this.addData(node, data, next) ;
          }
      );

  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
  }

  getStatusClass(item) {
      return !item.status ? '' : 'status-' + item.status ;
  }

  async loadMore(node, next) {
      if (node.type === 'streetId') { return ; } // ignore the node where its children are static
      if (node.children.length && !this.loading[next]) {
          this.pages[next] = !this.pages[next] ? 2 : ++this.pages[next];
          await this.load(node, next) ;
      }
  }

  addData(node, data, next) {
      let _data ;
      if (node.type !== 'oet' ) {
          _data = data ;
      } else { // handle the leafs case, the api response is quit different.
          data.forEach((_new) => { if (node.subtype === _new.subtype) { _data = _new.children; } });
      }
      if (_data) { node.children = node.children.concat(_data); }
      // if the results was lass than the tree pagination results count, keep this node in loading state.
      if (_data && _data.length >= this.paginationOptions.get_tree_pagination) {
          this.loading[next] = false ;
      }
  }

  onDrop(event, parent) {
      const item = this.getItem(event.data.next);
      this.moveNode(item, parent, event.data.next);
      this.dragging = null;
  }

  moveNode(node, to, next, validated = false ) {
      const oldParent = node.parent ;
      if (this.listTreeService.moveItem(node, to, this.preDispatch, validated)) {
          this.loading[next] = false ;
          this.expanded[next] = false ;
      }
      if (!oldParent.children.length) {
          const location = next.split(':').slice(0, -1).join(',') ;
          this.loading[location] = false ;
          this.expanded[location] = false ;
      }
  }

  onDragStart(event, item) {
      this.dragging = item ;
      // document.body.style.cursor = 'grabbing';
  }

  isDropLocation(item): boolean {
      if (!this.dragging) {
          return false;
      }
      if (this.dragging.parent.id === item.id) {
          return false ;
      }
      if (this.dragging.parent.type === item.type && this.dragging.parent.parent.id === item.parent.id) {
          return true ;
      }
      return false ;
  }

  isNonDropLocation(item): boolean {
      if (!this.dragging) {
          return false;
      }
      if (this.dragging.parent.type === item.type && this.dragging.parent.parent.id === item.parent.id) {
          return false ;
      }
      return true;
  }

  getItem(next: string, id = null) {
      const location = next.split(':');

      let item: TreeNodeInterface = this.tree[0] ;
      location.forEach((elm) => {
          if (elm === '') { return ; }
          item = item.children[elm] ;
      });
      if (id) {
          const temp = item.children.filter((elm) => elm.id === id) ;
          item = temp.length ? temp[0] : null;
      }
      return item ;
  }

  openMoveItemModal(event, modal) {
      this.modalService.open(modal);
      this.move_to_items = [] ;
      if (event.item.node.type === 'streetId') {
          this.listTreeService.getMoveToCaps(this.preDispatch, event.item.node.parent.parent.id, event.item.node.parent.id).subscribe(
              data => {
                  this.move_to_items = data.data ;
              }
          );
      } else if (event.item.node.type === 'capId') {
          this.listTreeService.getMoveToCities(this.preDispatch, event.item.node.parent.id).subscribe(
              data => {
                  this.move_to_items = data.data ;
              }
          );
      }
      this.toMoveItem = event.item ;
  }

  openChangeStartPointModal(event, modal) {
      this.modalService.open(modal);
      this.all_start_points = [] ;
      this.addressesActionsService.getAllStartPoints().subscribe(
          data => {
              this.all_start_points = data.data ;
      });
  }
  openChangeEndPointModal(event, modal) {
      this.modalService.open(modal);
      this.all_start_points = [] ;
      this.addressesActionsService.getAllEndPoints().subscribe(
          data => {
              this.all_end_points = data.data ;
      });
  }

  submitMoveItem(select) {
      if (!select.itemsList.selectedItems[0]) {
          return ;
      }
      const moveTo = select.itemsList.selectedItems[0] ;
      moveTo.type = this.toMoveItem.node.parent.type;
      this.moveNode(this.toMoveItem.node, moveTo.value, this.toMoveItem.next, true);
  }

  isMovable(item) {
      if (item.node) {
          item = item.node;
      }
      return item.type === 'capId' || item.type === 'streetId' ;
  }

  async reloadNode(event) {
      event.item.node.children = [] ;
      this.loading[event.item.next] = false ;
      this.pages[event.item.next] = 0 ;
      await this.load(event.item.node, event.item.next);
  }


  rename(text, input) {
      text.style.display = 'none';
      input.style.display = 'inline-block';
  }

  nameChanged(event, item, text, input) {
      text.style.display = 'inline-block';
      input.style.display = 'none';
      if (!event.target.value.trim()){
          return ;
      }
      const old = item.text ;
      item.text = event.target.value ;

      if (item.type === 'cityId') {
          this.addressesActionsService.renameCity(item.id, this.preDispatch, event.target.value).subscribe(
              data => {
                  this.snotifyService.success('City renamed successfully', { showProgressBar: false});
              },
              error => {
                  item.text = old ;
                  this.snotifyService.error('City was not renamed', { showProgressBar: false, timeout: 3000 });
              }
          );
      } else if (item.type === 'streetId') {
          this.addressesActionsService.renameStreet(item.parent.parent.id, this.preDispatch, item.parent.id, item.id, event.target.value)
              .subscribe(
              data => {
                  this.snotifyService.success('Street renamed successfully', { showProgressBar: false});
              },
              error => {
                  item.text = old ;
                  this.snotifyService.error('Street was not renamed', { showProgressBar: false, timeout: 3000 });
              }
          );
      }
  }

  submitChangeStartPoint(select) {
      if (!select.itemsList.selectedItems[0]) {
          return ;
      }
      this.addressesActionsService.updatePoreDispatchStartPoint(this.preDispatch, select.itemsList.selectedItems[0].value.id).subscribe(
          data => {
              this.snotifyService.success('Start Point updated successfully', { showProgressBar: false});
              this.startPointTextInput.nativeElement.value = select.itemsList.selectedItems[0].value.text ;
          },
          error => {
              this.snotifyService.error('Start point was not updated', { showProgressBar: false});
          }
      );
  }

  submitChangeEndPoint(select) {
      if (!select.itemsList.selectedItems[0]) {
          return ;
      }
      this.addressesActionsService.updatePoreDispatchEndPoint(this.preDispatch, select.itemsList.selectedItems[0].value.id).subscribe(
          data => {
              this.snotifyService.success('End Point updated successfully', { showProgressBar: false});
              this.endPointTextInput.nativeElement.value = select.itemsList.selectedItems[0].value.text ;
          },
          error => {
              this.snotifyService.error('End point was not updated', { showProgressBar: false});
          }
      );
  }
  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }


}
