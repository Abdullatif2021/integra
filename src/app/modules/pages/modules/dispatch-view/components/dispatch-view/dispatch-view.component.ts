import {Component, OnInit} from '@angular/core';
import {MapService} from '../../../../../../service/map.service';
import {MapMarker} from '../../../../../../core/models/map-marker.interface';
import {ActivatedRoute} from '@angular/router';
import {DispatchViewService} from '../../service/dispatch-view.service';

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

    constructor(
        private mapService: MapService,
        private route: ActivatedRoute,
        private dispatchViewService: DispatchViewService
    ) {
        this.dispatch = route.snapshot.params.id;
    }

    ngOnInit() {
        this.loadData();
        this.loadPath();
    }

    loadPath() {
        this.dispatchViewService.getSetPath(this.dispatch).subscribe(
            path => {
                this.paths = [JSON.parse(path.data.path)];
                path.data.coordinates.forEach((elm) => {
                    const priority = (elm.groups ? elm.groups[0].map_priority : elm.priority) + 1 + '';
                    const icon = `https://mt.google.com/vt/icon/text=${priority}&psize=16&font=fonts/arialuni_t.ttf&color=ff330000` +
                        `&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1`;
                    let infoWindowText = `
                                <table class="table">
                                    <thead><tr><th class="text-center">Order</th>
                                        <th scope="col" class="text-center">Recipient</th><th class="text-center">Act code</th>
                                        <th class="text-center">Product</th><th class="text-center">Barcode</th></tr>
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
                if (path.data.start_point.lat === path.data.endPoint.lat &&
                    path.data.start_point.long === path.data.endPoint.long ) {
                    this.markers.push({
                        lat: path.data.start_point.lat,
                        lng: path.data.start_point.long,
                        label: 'Start/End',
                        title: path.data.start_point.text,
                        id: 'start+end+point',
                        icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
                        infoWindow: false,
                        onClick: () => {}
                    });
                } else {
                    this.markers.push({
                        lat: path.data.start_point.lat,
                        lng: path.data.start_point.long,
                        label: 'Start',
                        title: path.data.start_point.text,
                        id: 'start+point',
                        icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
                        infoWindow: false,
                        onClick: () => {}
                    });
                    this.markers.push({
                        lat: path.data.endPoint.lat,
                        lng: path.data.endPoint.long,
                        label: 'End',
                        title: path.data.endPoint.text,
                        id: 'end+point',
                        icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png?color=ff333333&scale=1.2',
                        infoWindow: false,
                        onClick: () => {}
                    });
                }
            }
        );
    }



    loadData() {
        if (this.loading) { return ; }
        this.page += 1;
        this.data = this.data.concat([{skeleton: true}, {skeleton: true}, {skeleton: true}]);
        this.loading = true ;
        this.dispatchViewService.getDispatchData(this.dispatch, this.page).subscribe(
            data => {
                if (data.data && data.data.length) {
                    this.loading = false;
                }
                this.data.splice(-3);
                this.data = this.data.concat(data.data);
            },
            error => {
                this.loading = false;
                this.data.splice(-3);
            }
        );
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

    mapReady(map) {
        const that = this;
        map.addListener('dragend', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
            console.log(that.latitude, that.longitude);
        });
        map.addListener('zoom_changed', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
        });
    }
}
