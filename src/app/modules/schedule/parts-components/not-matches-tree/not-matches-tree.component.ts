import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ListTreeService} from '../../service/list-tree.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/internal/operators';
import {SettingsService} from '../../../../service/settings.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {DropEffect} from 'ngx-drag-drop';
import {DragAndDropService} from '../../../../service/drag-and-drop.service';
import {ScheduleService} from '../../service/schedule.service';

@Component({
  selector: 'app-not-matches-tree',
  templateUrl: './not-matches-tree.component.html',
  styleUrls: ['./not-matches-tree.component.css']
})
export class NotMatchesTreeComponent implements OnInit, OnDestroy {

  constructor(
      private listTreeService: ListTreeService,
      private route: ActivatedRoute,
      private settingsService: SettingsService,
      private dragAndDropService: DragAndDropService,
      private scheduleService: ScheduleService
  ) { }


  unsubscribe = new EventEmitter();
  tree = <TreeNodeInterface[]>[
      // The root node of the tree .
      {id: '0', text: '', subtype: '', children: <TreeNodeInterface[]>[], parent: <TreeNodeInterface>{}, type: 'root', status: 0, page: 0}
  ];
  preDispatch;
  preDispatchData;
  paginationOptions: any = {};
  itemsCount = 0;
  data: TreeNodeInterface[] ;

  async ngOnInit() {
      this.preDispatch = this.route.snapshot.params.id;
      this.preDispatchData = this.route.snapshot.data.data ;
      this.settingsService.getPaginationOptions().pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode === 200) {
                  this.paginationOptions = data.data;
              }
          },
      );

      const list = [] ;
      this.data.forEach((elm: TreeNodeInterface) => {
          elm.parent = this.tree[0] ;
          list.push(elm);
      });
      this.tree[0].children = list ;

      this.dragAndDropService.dropped.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (!this.tree[0].children || !this.tree[0].children.length) {
                  this.scheduleService.showRightSideMap();
              }
          }
      );
  }

  // List Tree Methods

  async listNode(node, next) {
      if (!node.expanded && !node.children.length) {
          await this.load(node, next);
      }
      node.expanded = !node.expanded;
  }

  async load(node, next) {
      if (node.loading || (node.page && node.type === 'oet'))  {
          return;
      }
      node.loading = true;
      node.children.push({skeleton: true});
      this.listTreeService.listNode(this.preDispatch, node, node.page, null, 'not-matches-tree').then(
          data => {
              node.children.pop();
              this.addData(node, data);
          }
      );

  }

  async loadMore(node, next) {
      if (node.type === 'streetId' || (node.type !== 'oet')) {
          return;
      } // ignore the node where its children are static
      if (node.children.length && !node.loading) {
          node.page = !node.page ? 2 : ++node.page;
          await this.load(node, next);
      }
  }

  addData(node, data) {
      let _data;
      if (node.type !== 'oet') {
          _data = data;
      } else { // handle the leafs case, the api response is quit different.
          data.forEach((_new) => {
              if (node.subtype === _new.subtype) {
                  _data = _new.children;
              }
          });
      }
      if (_data) {
          node.children = node.children.concat(_data);
      }
      // if the results was lass than the tree pagination results count, keep this node in loading state.
      if (_data && _data.length >= this.paginationOptions.get_tree_pagination) {
          node.loading = false;
      } else {
      }
  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
  }

  getStatusClass(item) {
      return !item.status ? '' : 'status-' + item.status;
  }

  getStepIdx(idx) {
    if (idx === 0) {
        this.itemsCount = 0;
    }
    return this.itemsCount++;
  }

  onDragStart(event, item) {
      this.dragAndDropService.drag(item, true);
  }

  // Life Cycle OnDestroy

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
