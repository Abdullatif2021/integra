import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListTreeService} from '../../service/list-tree.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {LocatingService} from '../../service/locating.service';
import {takeUntil} from 'rxjs/internal/operators';

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
      private locatingService: LocatingService
  ) {
      this.preDispatch = this.route.snapshot.params.id;
  }

// { id: 1, selected: true, marker: 'A', name: 'Bologna', warning: true, qta: 14, children: [], status: 1}

  tree = <TreeNodeInterface[]>[
      {text: '', id: '0', children: [], parent: <TreeNodeInterface>{}, type: 'root'}
  ] ;



  expanded = {} ;
  async ngOnInit() {
      this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0]) ;
      this.locatingService.treeCreated.pipe(takeUntil(this.unsubscribe)).subscribe(
          async data => {this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0]) ; }
      );
  }

  async more(node, next) {
    if (! this.expanded[next]) {
      this.expanded[next] = true ;
      if (!node.children.length) {
        node.children = [{skeleton: 1}]; // Add Loader
        node = await this.listTreeService.listNode(this.preDispatch, node);
      }
    } else { this.expanded[next] = false ; }
  }

  getLvlClass(next) {
      return ('lvl-' + (next + '').split(':').length);
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
