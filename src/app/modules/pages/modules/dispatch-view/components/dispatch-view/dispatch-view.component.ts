import {Component, OnInit} from '@angular/core';
import {MapService} from '../../../../../../service/map.service';
import {MapMarker} from '../../../../../../core/models/map-marker.interface';
import {ActivatedRoute} from '@angular/router';
import {DispatchViewService} from '../../service/dispatch-view.service';
import {MapsAPILoader} from '@agm/core';
import {SetStatusModalComponent} from '../../../../../../shared/modals/set-status-modal/set-status-modal.component';
import {ActionsService} from '../../../../../../service/actions.service';
import {PaginationService} from '../../../../../../service/pagination.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dispatch-view',
    templateUrl: './dispatch-view.component.html',
    styleUrls: ['./dispatch-view.component.css']
})
export class DispatchViewComponent implements OnInit {

    latitude = 40.8440337;
    longitude = 14.3435834;
    zoom = 11;
    markers: MapMarker[] = [];
    paths = [] ;
    data = [] ;
    page = 0;
    loading = false;
    dispatch: number;
    dragging = null ;
    pathSubscription: any = null ;
    startPoint;
    endPoint;

    constructor(
        private mapService: MapService,
        private route: ActivatedRoute,
        private dispatchViewService: DispatchViewService,
        private mapsAPILoader: MapsAPILoader,
        private actionsService: ActionsService,
        private paginationService: PaginationService,
        private translate: TranslateService,
    ) {
    translate.setDefaultLang('itly');
    const browserLang = translate.getBrowserLang();
    this.dispatch = route.snapshot.params.id;
    }

    ngOnInit() {
        this.paginationService.updateLoadingState(false);
        this.paginationService.updateCurrentPage(-1);
        this.paginationService.updateResultsCount(-1);
        this.loadData();
        this.mapsAPILoader.load().then(() => {
            this.loadPath();
        });
    }

    async loadPath(onlyMarkers = false) {
        let markersData = [];
        if (onlyMarkers) {
            const temp = await <any>this.dispatchViewService.getSetMarkers(this.dispatch).toPromise();
            markersData = temp.data.data ;
        } else {
            if (this.pathSubscription) {
                this.pathSubscription.unsubscribe();
            }
            const path = await <any>this.dispatchViewService.getSetPath(this.dispatch).toPromise();
            markersData = path.data.coordinates ;
            this.paths = [JSON.parse(path.data.path)];
            this.startPoint = path.data.start_point ;
            this.endPoint = path.data.endPoint;
        }

        markersData.forEach((elm) => {
            const priority = (elm.groups ? elm.groups[0].map_priority : elm.priority) + 1 + '';
            const icon = `https://mt.google.com/vt/icon/text=${priority}&psize=16&font=fonts/arialuni_t.ttf&color=ff330000` +
                `&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1`;
            let infoWindowText = `
                                <table class="table">
                                    <thead><tr><th class="text-center">Order</th>
                                        <th scope="col" class="text-center">Destinatario</th><th class="text-center">Codice Atto</th>
                                        <th class="text-center">Prodotto</th><th class="text-center">Codice a Barre</th></tr>
                                    </thead><tbody>`;
            elm.groups.forEach(group => {
                group.products.forEach(product => {
                    infoWindowText += `
                                    <tr>
                                        <th class="text-center">${product.priority + 1}</th>
                                        <td class="text-center">${product.recipient.name}</td>
                                        <td class="text-center">${product.act_code}</td>
                                        <td class="text-center">${product.integra_name.name}</td>
                                        <td class="text-center">${product.barcode}</td>
                                    </tr>`;
                });
            });
            infoWindowText += `</tbody></table>`;
            this.markers.push({
                lat: elm.lat,
                lng: elm.long,
                label: '',
                title: elm.name,
                id: elm.id,
                icon: icon,
                infoWindow: {
                    text: infoWindowText,
                    isOpen: false
                },
                onClick: () => {
                }
            });
        });
        // add start and end points.
        if (this.startPoint.lat === this.endPoint.lat &&
            this.startPoint.long === this.endPoint.long ) {
            this.markers.push({
                lat: this.startPoint.lat,
                lng: this.startPoint.long,
                label: 'Start/End',
                title: this.startPoint.text,
                id: 'start+end+point',
                icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
                infoWindow: false,
                onClick: () => {}
            });
        } else {
            this.markers.push({
                lat: this.startPoint.lat,
                lng: this.startPoint.long,
                label: 'Start',
                title: this.startPoint.text,
                id: 'start+point',
                icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
                infoWindow: false,
                onClick: () => {}
            });
            this.markers.push({
                lat: this.endPoint.lat,
                lng: this.endPoint.long,
                label: 'End',
                title: this.endPoint.text,
                id: 'end+point',
                icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
                infoWindow: false,
                onClick: () => {}
            });
        }
    }

    async loadData() {
        if (this.loading) { return ; }
        this.page += 1;
        this.loading = true;
        this.data = this.data.concat([{skeleton: true}, {skeleton: true}, {skeleton: true}]);
        const data = await this.dispatchViewService.getDispatchGroups(this.dispatch, this.page).catch(e => {});
        this.data.splice(-3);
        if (!data || !data.length) { return ; }
        this.loading = false;
        this.data = this.data.concat(data);
        if (data && data.length && data[0].state === 'prepared') {
            this.handleActions(true);
        }
    }

    handleActions(isPrepared) {
        if (!isPrepared) { return ;}
        this.actionsService.setActions([
            {
                name: this.translate.instant('pages.dispatch_view.action.action_name'), fields: [
                    { type: 'select', field: 'method', options: [
                            {name: this.translate.instant('pages.dispatch_view.action.selected'), value: 'selected'},
                            {name: this.translate.instant('pages.dispatch_view.action.by_filter'), value: 'filters'}
                        ], selectedAttribute: {name: 'Selezionati', value: 'selected'}
                    }
                ],
                modal: SetStatusModalComponent,
                modalData: {
                    selected: () => this.dispatchViewService.getSelectedProducts() ,
                    state: 'in_delivery'
                },
            },
        ]);
    }

    onDragStart(event, item) {
        this.dragging = item;
    }

    onDrop(event) {
        const d_index = this.data.indexOf( this.dragging ) ;
        const index = event.index;
        if (d_index > index ) {
            this.data.splice( d_index, 1 );
            this.data.splice( index, 0, this.dragging );
        } else {
            this.data.splice(index, 0, this.dragging);
            this.data.splice(d_index, 1);
        }
        this.dispatchViewService.orderTreeNode(this.dragging.id, event.index, this.dispatch).subscribe(
            data => {
                this.loadPath(true);
            }
        );
    }

    onDragEnd() {
        this.dragging = null ;
    }

    trackMarkers(marker) {
        return marker.id + '-' + marker.type;
    }

    navigateMap(event) {
        if (!event.hasObject || !event.address.lat || !event.address.lng) {
            return;
        }
        this.latitude = event.address.lat;
        this.longitude = event.address.lng;
        this.zoom = 15.5;
    }

    mapClick(event) {
        this.mapService.mapClicked(event);
    }

    select(item, level) {
        if (level === 'product') {
            item.selected = !item.selected ;
            if (item.selected) {
                item.parent.selected = item.parent.products.find((i) => !i.selected) ? 2 : 1;
                this.dispatchViewService.selectedProducts.push(item.id);
            } else {
                item.parent.selected = item.parent.products.find((i) => i.selected) ? 2 : 0;
                this.dispatchViewService.selectedProducts = this.dispatchViewService.selectedProducts.filter( i => i.id === item.id);
            }
        }

        if (level === 'address') {
            item.selected = !item.selected ? 1 : 0 ;
            item.products.map(p => p.selected = item.selected);
            if (item.selected) {
                this.dispatchViewService.selectedProducts = this.dispatchViewService.selectedProducts.concat(item.products.map(p => p.id));
            } else {
                this.dispatchViewService.selectedProducts =
                this.dispatchViewService.selectedProducts.filter( i => !item.products.find(j => j.id === i));
            }
        }
        console.log(this.dispatchViewService.getSelectedProducts());
    }

    mapReady(map) {
        const that = this;
        map.addListener('dragend', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
        });
        map.addListener('zoom_changed', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
        });
    }
}
