import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListTreeService} from '../../service/list-tree.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {LocatingService} from '../../service/locating.service';
import {takeUntil} from 'rxjs/internal/operators';
import {SettingsService} from '../../../../service/settings.service';

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
      private settingsService: SettingsService
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

  async ngOnInit() {
      this.locatingService.treeCreated.pipe(takeUntil(this.unsubscribe)).subscribe(
          async data => {this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0]) ; }
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
      this.loading[next] = true ;
      node.children.push({skeleton: true}) ;
      const data: TreeNodeInterface[] = await this.listTreeService.listNode(this.preDispatch, node, this.pages[next]);
      node.children.pop();
      this.addData(node, data, next) ;
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

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
