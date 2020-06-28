import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../config/app.config';
import {Observable} from 'rxjs';
import {TreeNodeInterface, TreeNodeResponseInterface} from '../../../core/models/tree-node.interface';
import {takeUntil} from 'rxjs/internal/operators';
import {SetClientTreeNodeInterface, SetTreeNodeInterface} from '../../../core/models/set-tree-node.interface';
import {MarkersService} from './markers.service';

@Injectable()
export class ResultsService implements OnDestroy {

    constructor(
        private http: HttpClient,
        private markersService: MarkersService
    ) {
    }

    unsubscribe = new EventEmitter();
    markers = {cities: 65, caps: {}} ;
    levels = ['set', 'cityId', 'capId', 'streetId', 'client', 'end'];

    getScheduleResults(preDispatch, type = 'not_assigned') {
        return new Promise((resolve, reject) => {
            const options = {params: new HttpParams()};
            options.params = options.params.set('type', type);
            this.http.get<any>(AppConfig.endpoints.getSetByStatus(preDispatch), options)
                .subscribe(
                data => {
                    if (!data.success) { return reject(data); }
                    const res = [] ;
                    // convert api response to Nodes
                    data.data.forEach((elm) => {
                        const sets = [] ;
                        elm.sets.forEach((set) => {
                           sets.push({
                               id: set.id, type: 'set', children: [], parent: null, text: '', postman: set.postman,
                               quantity: set.quantity, page: 1, expanded: false, setId: set.id, loaded: false, addressId: set.addressId,
                               is_distenta_created: set.is_distenta_created, have_not_fixed_products: set.have_not_fixed_products
                           });
                        });
                        res.push({day: elm.day, sets: sets});
                    });
                    resolve(res) ;
                }, error => { reject(error); }
            );
        });
    }

    listNode(node: SetTreeNodeInterface): Promise<SetTreeNodeInterface[]> {
        return new Promise<SetTreeNodeInterface[]>(async (resolve, reject) => {
            const result = [];
            const type = this.levels[this.levels.indexOf(node.type) + 1];
            const data: any = await this.loadNode(node).pipe(takeUntil(this.unsubscribe)).toPromise();
            if (!data) {
                return reject();
            }
            data.data.forEach((elm) => {
                result.push(this.createNode(elm, type, node));
            });
            return resolve(result);
        });
    }

    createNode(elm, type, parent): SetTreeNodeInterface | SetClientTreeNodeInterface {
        if (type === 'client') {
            return {
                id: elm.id, address: this.getAddress(elm, parent), loaded: false, parent: parent, type: 'building', addressId: elm.addressId
            };
        } else {
            const node = {
                id: elm.id, type: type, children: [], parent: parent, text: elm.name, loaded: false, addressId: elm.addressId,
                qta: elm.count, page: 1, expanded: false, setId: parent.setId, marker: this.getMarker(type, parent)
            };
            node.marker = this.markersService.getNodeMarker(node, elm.priority);
            return node ;
        }
    }

    getAddress(elm: any, parent: SetTreeNodeInterface): string {
        let name = (elm.old_street_name ? (elm.old_street_name) : (parent.text.trim())) + ', ' +
            (elm.house_number ? elm.house_number : (elm.extra ? elm.extra.house_number : '')) + ' , ';
        parent = parent.parent ;
        while (true) {
            if (!parent || !parent.id || !parent.text) {
                break;
            }
            name += parent.text + ' ';
            parent = parent.parent;
        }
        return name;
    }

    loadNode(node: SetTreeNodeInterface): Observable<TreeNodeResponseInterface> {
        const options = {params: new HttpParams()};
        options.params = options.params.set(node.type, node.id);
        let parent: TreeNodeInterface = node.parent;
        while (true) {
            if (!parent || !parent.id) {
                break;
            }
            options.params = options.params.set(parent.type, parent.id);
            parent = parent.parent;
        }
        options.params = options.params.set('page', node.page.toString());

        return this.http.get<any>(AppConfig.endpoints.getSetTreeNode(node.setId), options);
    }

    getMarker(type, parent) {
        if (type === 'cityId') {
            return String.fromCharCode(this.markers.cities++);
        } else if (type === 'capId') {
            if (!this.markers.caps[parent.id]) {
                this.markers.caps[parent.id] = 1;
            }
            return parent.marker + this.markers.caps[parent.id]++ ;
        }
        return false ;
    }

    getPostmenByPreDispatch(preDispatch) {
        return this.http.get<any>(AppConfig.endpoints.getPostmenByPreDispatch(preDispatch), {});
    }

    assignPostman(postmanId, setId) {
        return this.http.post<any>(AppConfig.endpoints.updateSetPostman(setId), {
            postman_id: postmanId
        });
    }
    makeDispatchesVisible(postmanId, sets) {
        return this.http.post<any>(AppConfig.endpoints.publishPreDispatchSets(postmanId), {sets: sets});
    }

    getSetPath(setId): Observable<TreeNodeResponseInterface> {
        return this.http.get<any>(AppConfig.endpoints.getSetPath(setId));
    }
    getSetMarkers(setId): Observable<TreeNodeResponseInterface> {
        return this.http.get<any>(AppConfig.endpoints.getSetMarkers(setId));
    }

    assignToSet(setId, addressId, assignTo, level, type) {
        const roots = {cityId: 1, capId: 2, streetId: 3, building: 4};
        const data = {
            data: [
                {
                    root: roots[type],
                    addressId: addressId,
                    assignTo: assignTo,
                    level: level
                }
            ]
        };
        return this.http.post<any>(AppConfig.endpoints.assignToSet(setId), data);
    }

    orderTreeNode(groupId, level) {
        const data = {
            newPriority: level
        };
        return this.http.post<any>(AppConfig.endpoints.shiftGroupPriority(groupId), data);
    }

    getSetGroups(set) {
        return new Promise((resolve, reject) => {
            this.sendGetSetGroupsRequest(set.id, set.page).subscribe(
                data => {
                    if (!data.success) { return reject(data); }
                    resolve(this.reshapeGroupsData(set, data.data));
                },
                error => reject(error)
            );
        });
    }

    reshapeGroupsData(parent, groups) {
        const result = [] ;
        for (let i = 0; i < groups.length; ++i) {
            result.push({
                id: groups[i].id,
                address: groups[i].address[0] ,
                loaded: false,
                parent: parent,
                type: 'building',
                addressId: groups[i].id,
                priority: groups[i].mapPriority,
                productsCount: groups[i].productsCount,
                fromNotFixed: groups[i].fromNotFixed,
            });
            result[i]['products'] = this.reshapeGroupProducts(groups[i].products, result[i]);
        }
        return result ;
    }

    reshapeGroupProducts(products, group) {
        if (!products || !products.length) { return []; }
        for (let i = 0; i < products.length; ++i) {
            products[i].parent = group ;
        }
        return products;
    }
    sendGetSetGroupsRequest(setId, page = 1) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('page', page + '');
        options.params = options.params.set('pageSize', '15');

        return <any>this.http.get(AppConfig.endpoints.getSetGroups(setId), options);
    }

    moveResultsTo(to, selected, preDispatch) {
        // create the data shape
        const items = [] ;
        selected.forEach(item => {
            items.push({
                id: item.id,
                state: to,
                root: item._type === 'set' ? 1 : (item._type === 'group' ? 2 : 3),
                parent: item._type === 'product' ? item.group_id : ( item._type === 'set' ? null : item.parent.id)
            });
        });
        return <any>this.http.post(AppConfig.endpoints.deleteResults(preDispatch), {items: items});
    }

    getNotFixedItems(preDispatch, page = 1) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('page', page + '');
        options.params = options.params.set('pageSize', '15');
        return <any>this.http.get(AppConfig.endpoints.getNotFixedItems(preDispatch), options);
    }

    createNewGroup(preDispatch, list, index) {
        const data = {products: list, priority: index};
        return <any>this.http.post(AppConfig.endpoints.createNewGroup(preDispatch), data);
    }

    moveNotFixesGroupToSet(data) {
        // const data = {set: set, priority: index};
        return <any>this.http.post(AppConfig.endpoints.moveNotFixesGroupToSet, {groups: data});
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
