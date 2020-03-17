import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams,} from '@angular/common/http';
import {AppConfig} from '../../../config/app.config';
import {Observable} from 'rxjs';
import {TreeNodeInterface, TreeNodeResponseInterface} from '../../../core/models/tree-node.interface';
import {takeUntil} from 'rxjs/internal/operators';
import {SetClientTreeNodeInterface, SetTreeNodeInterface} from '../../../core/models/set-tree-node.interface';

@Injectable()
export class ResultsService implements OnDestroy {

    constructor(
        private http: HttpClient,
    ) {
    }

    unsubscribe = new EventEmitter()
    markers = {cities: 65, caps: {}} ;
    levels = ['set', 'cityId', 'capId', 'streetId', 'client', 'end'];

    getScheduleResults(preDispatch) {
        return new Promise((resolve, reject) => {
            this.http.get<any>(AppConfig.endpoints.getScheduleResults(preDispatch), {})
                .subscribe(
                data => {
                    if (!data.success) { return reject(false); }
                    const res = [] ;
                    // convert api response to Nodes
                    data.data.forEach((elm) => {
                        const sets = [] ;
                        elm.sets.forEach((set) => {
                           sets.push({
                               id: set.id, type: 'set', children: [], parent: null, text: '', postman: set.postman,
                               qta: set.products_count, page: 1, expanded: false, setId: set.id, loaded: false, addressId: set.addressId
                           });
                        });
                        res.push({day: elm.day, sets: sets});
                    });
                    resolve(res) ;
                }, error => { reject(error);}
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
            return {
                id: elm.id, type: type, children: [], parent: parent, text: elm.name, loaded: false, addressId: elm.addressId,
                qta: elm.count, page: 1, expanded: false, setId: parent.setId, marker: this.getMarker(type, parent)
            };
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
    makeDispatchesVisible(postmanId) {
        return this.http.post<any>(AppConfig.endpoints.makeDispatchesVisible(postmanId), {});
    }

    assignToSet(setId, addressId, assignTo, level, type) {
        const roots = {cityId: 1, capId: 2, streetId: 3, building: 4}
        const data = {
            data: [
                {
                    root: roots[type],
                    addressId: addressId,
                    assignTo: assignTo,
                    level: level
                }
            ]
        }
        return this.http.post<any>(AppConfig.endpoints.assignToSet(setId), data);
    }
    orderTreeNode(preDispatch, addressId, level, type) {
        const roots = {cityId: 1, capId: 2, streetId: 3, building: 4}
        const data = {
            data: [
                {
                    root: roots[type],
                    element_id: addressId,
                    level: level
                }
            ]
        }
        return this.http.post<any>(AppConfig.endpoints.orderTreeNode(preDispatch), data);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
