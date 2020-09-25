import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig} from '../../../../../config/app.config';
import {Observable} from 'rxjs';
import {group} from '@angular/animations';

@Injectable()
export class DispatchViewService {

    constructor(
        private http: HttpClient,
    ) {
    }


    // TODO remove this.
    getDispatchData(dispatch, page = 1): Observable<any> {
        const options = {params: new HttpParams()};
        options.params = options.params.set('page', `${page}`);
        options.params = options.params.set('pageSize', '15');
        return this.http.get<any>(AppConfig.endpoints.getSetProductsAndPath(dispatch), options);
    }

    sendGetSetGroupsRequest(dispatch, page = 1) {
        const options = {params: new HttpParams()};
        options.params = options.params.set('page', page + '');
        options.params = options.params.set('pageSize', '15');
        return <any>this.http.get(AppConfig.endpoints.getSetGroups(dispatch), options);
    }

    getDispatchGroups(dispatch, page) {
        return new Promise<any[]>((resolve, reject) => {
            this.sendGetSetGroupsRequest(dispatch, page).subscribe(
                data => {
                    if (!data.success) {
                        return reject(data);
                    }
                    resolve(this.reshapeGroupsData({}, data.data));
                },
                error => reject(error)
            );
        });
    }

    orderTreeNode(groupId, level, set) {
        const data = {
            newPriority: level,
            set: set
        };
        return this.http.post<any>(AppConfig.endpoints.shiftGroupPriority(groupId), data);
    }

    reshapeGroupsData(parent, groups): any[] {
        const result = [];
        for (let i = 0; i < groups.length; ++i) {
            result.push({
                id: groups[i].id,
                address: groups[i].address[0],
                loaded: false,
                parent: parent,
                type: 'building',
                addressId: groups[i].id,
                priority: groups[i].mapPriority,
                productsCount: groups[i].productsCount,
                fromNotFixed: groups[i].fromNotFixed,
                state: groups[i].state
            });
            result[i]['products'] = this.reshapeGroupProducts(groups[i].products, result[i]);
        }
        return result;
    }

    reshapeGroupProducts(products, group) {
        if (!products || !products.length) { return []; }
        for (let i = 0; i < products.length; ++i) {
            products[i].parent = group ;
        }
        return products;
    }

    getSetPath(setId): Observable<any> {
        return this.http.get<any>(AppConfig.endpoints.getSetPath(setId));
    }

    getSetMarkers(setId): Observable<any> {
        return this.http.get<any>(AppConfig.endpoints.getSetMarkers(setId));
    }
}
