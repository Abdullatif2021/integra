import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TreeNodeInterface, TreeNodeResponseInterface} from '../../../core/models/tree-node.interface';
import {AppConfig} from '../../../config/app.config';
import {takeUntil} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';

@Injectable()
export class ListTreeService implements OnDestroy {

    constructor(
        private http: HttpClient,
    ) {}

    unsubscribe = new EventEmitter();
    levels = ['root', 'cityId', 'capId', 'streetId', 'oet', 'building', 'end'] ;

   listNode(preDispatchId: number, node: TreeNodeInterface, page = 1, namespace = '_'): Promise<TreeNodeInterface[]> {
       return new Promise<TreeNodeInterface[]>(async(resolve, reject) => {
           let result = <TreeNodeInterface[]>[];
           const type = this.getNextNodeType(node) ;
           const data: any = await this.loadNode(preDispatchId, node, page.toString()).pipe(takeUntil(this.unsubscribe)).toPromise();
           if (!data) { return reject(); }
           if (type === 'oet') {
               result = result.concat(this.handleBuildings(node, data));
           } else {
               data.data.forEach((elm) => {
                   result.push({id: elm.id, type: type, children: [], parent: node, text: elm.name, _end: false, status: 0});
               });
           }
           return resolve(node.children = result);
       });
   }

   loadNode(preDispatchId: number, node: TreeNodeInterface, page = '1'): Observable<TreeNodeResponseInterface> {
       const options = { params: new HttpParams()};
       options.params = options.params.set(node.type, node.id);
       let parent: TreeNodeInterface = node.parent ;
       while (true) {
           if (!parent.id) { break ; }
           options.params = options.params.set(parent.type, parent.id);
           parent = parent.parent ;
       }
       options.params = options.params.set('page', page);
       return this.http.get<TreeNodeResponseInterface>(AppConfig.endpoints.getTreeNode(preDispatchId), options);
   }


   getNextNodeType(node: TreeNodeInterface) {
       return this.levels[this.levels.indexOf(node.type) + 1];
   }

   handleBuildings(parent: TreeNodeInterface, data: TreeNodeResponseInterface): TreeNodeInterface[] {
       const items = [] ;
       for (const [key, children] of Object.entries(data.data)) {
           if (!children.length) { continue; }
           const randId = Math.random().toString(36).substr(2, 6) ;
           const item = <TreeNodeInterface>{id: randId, type: 'oet', parent: parent, children: [],
               text: key === 'odd' ? 'Civici Dispari' : (key === 'even' ? 'Civici Pari' : key), status: 0};
           item.children = this.productsToTreeNodes(children, item);
           items.push(item);
       }
       return items ;
   }

    nameBuilding(parent, elm): string {
        let name = parent.text + ' ' + elm.house_number + ' , ';
        parent = parent.parent ;
        while (true) {
            if (!parent.id) { break ; }
            name += parent.text + ' ' ;
            parent = parent.parent ;
        }
        return name ;
    }

    productsToTreeNodes(items, parent: TreeNodeInterface): TreeNodeInterface[] {
       const result = <TreeNodeInterface[]>[];
       items.forEach((elm) => {
           result.push( {id: elm.id, type: 'building', text: this.nameBuilding(parent.parent, elm),
               parent: parent, children: [], _end: true, status: 1} );
       });
       return result ;
   }

   ngOnDestroy() {
       this.unsubscribe.next();
       this.unsubscribe.complete();
   }


}
