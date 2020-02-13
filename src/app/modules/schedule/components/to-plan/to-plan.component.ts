import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListTreeService} from '../../service/list-tree.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {takeUntil} from 'rxjs/internal/operators';
import {SettingsService} from '../../../../service/settings.service';


@Component({
  selector: 'app-to-plan',
  templateUrl: './to-plan.component.html',
  styleUrls: ['./to-plan.component.css']
})
export class ToPlanComponent implements OnInit, OnDestroy {

  unsubscribe = new EventEmitter();
  tree = <TreeNodeInterface[]>[
      // The root node of the tree .
      {id: '0', text: '', subtype: '', children: <[TreeNodeInterface]>[], parent: <TreeNodeInterface>{}, type: 'root', status: 0, page: 0}
  ];
  preDispatch;
  paginationOptions: any = {};
  searchMode = false ;
  filter = [0, 0, 0];
  itemsCount = 0;

  constructor(
      private route: ActivatedRoute,
      private listTreeService: ListTreeService,
      private settingsService: SettingsService,
  ) {

      this.route.parent.params.subscribe(
          data => {
            this.preDispatch = data.id;
            this.listNode(this.tree[0]);
          }
      );
  }

  async ngOnInit() {
      this.settingsService.getPaginationOptions().pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode === 200) {
                  this.paginationOptions = data.data;
              }
          },
          error => {
              console.log(error);
          }
      );
  }

    // List Tree Methods

    async listNode(node) {
        if (!node.expanded && !node.children.length) {
            await this.load(node);
        }
        node.expanded = !node.expanded;
    }

    async load(node) {
        if (node.loading || this.searchMode || (node.page && node.type === 'oet'))  {
            return;
        }
        node.loading = true;
        node.children.push({skeleton: true});
        console.log(this.preDispatch);
        this.listTreeService.listNode(this.preDispatch, node, node.page, this.filter, 'to_planning').then(
            data => {
                node.children.pop();
                this.addData(node, data);
            }
        );

    }

    async loadMore(node, next) {
        if (node.type === 'streetId' || (node.type !== 'oet' && this.searchMode)) {
            return;
        } // ignore the node where its children are static
        if (node.children.length && !node.loading) {
            node.page = !node.page ? 2 : ++node.page;
            await this.load(node);
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
        }
    }

    async reloadNode(event) {
        event.item.node.children = [];
        event.item.node.loading = false;
        event.item.node.page = 0;
        await this.load(event.item.node);
    }


    // View Related Methods

    getStepIdx(idx) {
        if (idx === 0) {
            this.itemsCount = 0;
        }
        return this.itemsCount++;
    }

    getLvlClass(next) {
        return ('lvl-' + (next + '').split(':').length);
    }

    getStatusClass(item) {
        return !item.status ? '' : 'status-' + item.status;
    }

    select(node: TreeNodeInterface) {
        this.listTreeService.select.select(node);
    }

    // Life Cycle OnDestroy

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
