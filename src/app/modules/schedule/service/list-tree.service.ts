import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TreeNodeInterface, TreeNodeResponseInterface} from '../../../core/models/tree-node.interface';
import {AppConfig} from '../../../config/app.config';
import {takeUntil} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {SnotifyService} from 'ng-snotify';

@Injectable()
export class ListTreeService implements OnDestroy {

    constructor(
        private http: HttpClient,
        private snotifyService: SnotifyService,
    ) {}

    unsubscribe = new EventEmitter();
    levels = ['root', 'cityId', 'capId', 'streetId', 'oet', 'building', 'end'] ;

   listNode(preDispatchId: number, node: TreeNodeInterface, page = 1): Promise<TreeNodeInterface[]> {
       return new Promise<TreeNodeInterface[]>(async(resolve, reject) => {
           let result = <TreeNodeInterface[]>[];
           const type = this.getNextNodeType(node) ;
           const data: any = await this.loadNode(preDispatchId, node, page.toString()).pipe(takeUntil(this.unsubscribe)).toPromise();
           if (!data) { return reject(); }
           if (type === 'oet') {
               result = result.concat(this.handleBuildings(node, data));
           } else {
               data.data.forEach((elm) => {
                   result.push({id: elm.id, type: type, children: [], subtype: '', parent: node, text: elm.name, _end: false, status: 0});
               });
           }
           return resolve(result);
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
       return node.type === 'oet' ? 'oet' : this.levels[this.levels.indexOf(node.type) + 1];
   }

   handleBuildings(parent: TreeNodeInterface, data: TreeNodeResponseInterface): TreeNodeInterface[] {
       const items = [] ;
       for (const [key, children] of Object.entries(data.data)) {
           if (!children.length) { continue; }
           const randId = Math.random().toString(36).substr(2, 6) ;
           const item = <TreeNodeInterface>{id: randId, type: 'oet', subtype: key, parent: parent, children: [],
               text: key === 'odd' ? 'Civici Dispari' : (key === 'even' ? 'Civici Pari' : key), status: 0};
           item.children = this.productsToTreeNodes(children, item);
           items.push(item);
       }
       return items ;
   }

    nameBuilding(parent, elm): string {
        if (parent.type === 'oet') { parent = parent.parent ; }
        let name = parent.text + ' ' + (elm.house_number ? elm.house_number : (elm.extra ? elm.extra.house_number : '')) + ' , ';
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
           result.push( {id: elm.id, type: 'building', subtype: '', text: this.nameBuilding(parent.parent, elm),
               parent: parent, children: [], _end: true, status: 1, extra: {house_number: elm.house_number}} );
       });
       return result ;
   }


   relocateItem(item, parent, preDispatch) {
       // if (parent.parent.type === item.parent.type) {parent = parent.parent ;}
       if (parent.type !== item.parent.type || parent.id === item.parent.id) { return ; }
       if (item.type === 'streetId' && parent.parent.id !== item.parent.parent.id) { return ; }

       if (item.type === 'streetId') {
           this.sendMoveStreetRequest(item.parent.parent.id, item.parent.id, parent.id, item.id, preDispatch)
               .subscribe(
                   data => {
                       this.snotifyService.success('Street moved successfully', { showProgressBar: false});
                   }
               );
       } else if (item.type === 'capId') {
           this.sendMoveCapRequest(item.parent.id, parent.id, item.id, preDispatch)
               .subscribe(
                   data => {
                       this.snotifyService.success('Cap moved successfully', { showProgressBar: false});
                   }
               );
       }
       item.parent.children = item.parent.children.filter((elm) => elm.id !== item.id);
       item.parent = parent ;
       item.children = [] ;
       if (parent.children.length) {
           parent.children.push(item);
       }

       return true ;
   }

   sendMoveStreetRequest(city, cap_from, cap_to, street, preDispatch): Observable<ApiResponseInterface> {
       const formData = new FormData();
       formData.set('city_id', city);
       formData.set('cap_from_id', cap_from);
       formData.set('cap_to_id', cap_to);
       formData.set('street_id', street);
       formData.set('pre_dispatch_id', preDispatch);
       return this.http.post<ApiResponseInterface>(AppConfig.endpoints.moveStreet, formData);
   }

   sendMoveCapRequest(city_from, city_to, cap, preDispatch): Observable<ApiResponseInterface> {
       const formData = new FormData();
       formData.set('city_from_id', city_from);
       formData.set('city_to_id', city_to);
       formData.set('cap_id', cap);
       formData.set('pre_dispatch_id', preDispatch);
       return this.http.post<ApiResponseInterface>(AppConfig.endpoints.moveCap, formData);
   }

   ngOnDestroy() {
       this.unsubscribe.next();
       this.unsubscribe.complete();
   }

}
