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
    ) {
    }

    unsubscribe = new EventEmitter();
    levels = ['root', 'cityId', 'capId', 'streetId', 'oet', 'building', 'end'];
    searchLevels = {cityId: 'data', capId: 'caps', streetId: 'streets'} ;

    // List Tree Methods
    listNode(preDispatchId: number, node: TreeNodeInterface, page = 1, filter = 0): Promise<TreeNodeInterface[]> {
        return new Promise<TreeNodeInterface[]>(async (resolve, reject) => {
            let result = <TreeNodeInterface[]>[];
            const type = this.getNextNodeType(node);
            const data: any = await this.loadNode(preDispatchId, node, page.toString(), filter)
                .pipe(takeUntil(this.unsubscribe)).toPromise();
            if (!data) {
                return reject();
            }
            if (type === 'oet') {
                result = result.concat(this.handleBuildings(node, data));
            } else {
                data.data.forEach((elm) => {
                    result.push({
                        id: elm.id, type: type, children: [], subtype: '', parent: node, text: elm.name, _end: false,
                        status: 0, qta: elm.productCount ? elm.productCount : elm.productsCount, warning: !elm.isFixed
                    });
                });
            }
            return resolve(result);
        });
    }

    loadNode(preDispatchId: number, node: TreeNodeInterface, page = '1', filter = 0): Observable<TreeNodeResponseInterface> {
        const options = {params: new HttpParams()};
        options.params = options.params.set(node.type, node.id);
        let parent: TreeNodeInterface = node.parent;
        while (true) {
            if (!parent.id) {
                break;
            }
            options.params = options.params.set(parent.type, parent.id);
            parent = parent.parent;
        }
        options.params = options.params.set('page', page);
        if (filter === 1) {
            options.params = options.params.set('filter', 'true');
        } else if (filter === -1) {
            options.params = options.params.set('filter', 'false');
        }
        return this.http.get<TreeNodeResponseInterface>(AppConfig.endpoints.getTreeNode(preDispatchId), options);
    }


    getNextNodeType(node: TreeNodeInterface) {
        return node.type === 'oet' ? 'oet' : this.levels[this.levels.indexOf(node.type) + 1];
    }

    handleBuildings(parent: TreeNodeInterface, data: TreeNodeResponseInterface): TreeNodeInterface[] {
        const items = [];
        for (const [key, children] of Object.entries(data.data)) {
            if (!children.data.length) {
                continue;
            }
            const randId = Math.random().toString(36).substr(2, 6);
            const item = <TreeNodeInterface>{
                id: randId, type: 'oet', subtype: key, parent: parent, children: [], warning: !children.is_fixed,
                text: key === 'odd' ? 'Civici Dispari' : (key === 'even' ? 'Civici Pari' : key), status: 0, qta: children.count
            };
            item.children = this.productsToTreeNodes(children.data, item);
            items.push(item);
        }
        return items;
    }

    nameBuilding(parent, elm): string {
        if (parent.type === 'oet') {
            parent = parent.parent;
        }
        console.log((elm.house_number ? elm.house_number : (elm.extra ? elm.extra.house_number : '')));
        let name = parent.text.trim() + ', ' + (elm.house_number ? elm.house_number : (elm.extra ? elm.extra.house_number : '')) + ' , ';
        parent = parent.parent;
        while (true) {
            if (!parent.id) {
                break;
            }
            name += parent.text + ' ';
            parent = parent.parent;
        }
        console.log(name);
        return name + ', Italy';
    }

    productsToTreeNodes(items, parent: TreeNodeInterface): TreeNodeInterface[] {
        const result = <TreeNodeInterface[]>[];
        items.forEach((elm) => {
            result.push({
                id: elm.id, type: 'building', subtype: '', text: this.nameBuilding(parent.parent, elm),
                parent: parent, children: [], _end: true, status: !elm.house_number ? 3 : (elm.is_fixed ? 1 : 2),
                extra: {house_number: elm.house_number}, qta: elm.productsCount
            });
        });
        return result;
    }

    // Search Tree Methods

    sendSearchTreeRequest(preDispatchId: number, query: string) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('target', query);
        return this.http.get<any>(AppConfig.endpoints.searchTree(preDispatchId), options);
    }

    createTreeFromSearchResponse(data, type = 'cityId', parent = null): [TreeNodeInterface] {
       const tree = <[TreeNodeInterface]>[] ;
       data.forEach((elm) => {
           const node = this.createSearchResponseNode(elm, type, parent) ;
           const nextType = this.getNextNodeType(node) ;
           if (elm[this.searchLevels[nextType]]) {
               node.children = this.createTreeFromSearchResponse(elm[this.searchLevels[nextType]], nextType, node);
           }
           // if the node has no children set the node status no unclickable
           if (!node.children.length) {
               node.status = 4;
           }
           tree.push(node) ;
       });
       // handle the root node
       if (type === 'cityId') {
           return [{id: '0', text: '', subtype: '', children: tree, parent: <TreeNodeInterface>{}, type: 'root', status: 0}];
       }
       return tree ;
    }

    createSearchResponseNode(elm, type, parent) {
        return {
            id: elm.id, type: type, children: [], subtype: '', parent: parent, text: elm.name ,
            status: 0, qta: elm.productCount ? elm.productCount : elm.productsCount,
            warning: typeof elm.is_fixed !== 'undefined' ? !elm.is_fixed : elm.isFixed
        } ;
    }

    // Move Tree Node Methods

    moveItem(item, parent, preDispatch, validated = false) {
        // if (parent.parent.type === item.parent.type) {parent = parent.parent ;}
        if (!validated && parent.type !== item.parent.type || parent.id === item.parent.id) {
            return;
        }
        if (!validated && item.type === 'streetId' && parent.parent.id !== item.parent.parent.id) {
            return;
        }

        if (item.type === 'streetId') {
            this.sendMoveStreetRequest(item.parent.parent.id, item.parent.id, parent.id, item.id, preDispatch)
                .subscribe(
                    data => {
                        this.snotifyService.success('Street moved successfully', {showProgressBar: false});
                    }
                );
        } else if (item.type === 'capId') {
            this.sendMoveCapRequest(item.parent.id, parent.id, item.id, preDispatch)
                .subscribe(
                    data => {
                        this.snotifyService.success('Cap moved successfully', {showProgressBar: false});
                    }
                );
        }
        item.parent.children = item.parent.children.filter((elm) => elm.id !== item.id);
        item.parent = parent;
        item.children = [];
        if (parent.children && parent.children.length) {
            parent.children.push(item);
        }

        return true;
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

    getMoveToCaps(preDispatchId: number, city: string, cap: string) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('cityId', city);
        options.params = options.params.set('capId', cap);
        return this.http.get<any>(AppConfig.endpoints.getMoveToCap(preDispatchId), options);
    }

    getMoveToCities(preDispatchId: number, city: string) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('cityId', city);
        return this.http.get<any>(AppConfig.endpoints.getMoveToCity(preDispatchId), options);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
