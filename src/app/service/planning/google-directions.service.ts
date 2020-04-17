import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../settings.service';

@Injectable()
export class GoogleDirectionsService {

    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    invalid_keys_alerted = false ;

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('google_maps').then((data) => {
                this.keys = data.length ? data : [{name: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'}] ;
                resolve(true);
            });
        });
    }

    sendDirectionRequest(origin, waypoints, destination): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const directionsService = new (<any>window).google.maps.DirectionsService;
            directionsService.route({
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function(response, status) {
                if (status === 'OK') {
                    resolve(response);
                } else {
                    reject(status);
                }
            });
        });
    }

    clearWaypoints(waypoints) {
        console.log(waypoints);
        return waypoints.filter((elm) => elm.lat !== '0' && elm.long !== '0');
    }

    getDirections(origin, waypoints, destination): Promise<any> {
        return new Promise<any>(async (resolve) => {
            let path = [] ;
            const order = [] ;
            let order_count = 0;
            waypoints = this.clearWaypoints(waypoints);
            const d_waypoints = [...waypoints] ;
            while (waypoints.length) {
                const _origin = this.convertPoint(path.length ? path[path.length - 1] : origin);
                const _waypoints = this.convertMultiplePoints(waypoints.splice(0, 25));
                const _destination = this.convertPoint(waypoints.length ? waypoints.splice(0, 1)[0] : destination);
                const dRes = await this.sendDirectionRequest(_origin, _waypoints, _destination).catch((e) => {
                    console.log(e);
                });
                if (!dRes || dRes.status !== 'OK') {
                    if (dRes && dRes.status === 'REQUEST_DENIED') {
                        this.handleExpiredToken();
                    }
                    return resolve(path) ;
                }
                dRes.routes[0].waypoint_order.forEach((idx) => {
                   order.push({ id: d_waypoints[idx].id, priority: order_count++ });
                });
                d_waypoints.splice(0, dRes.routes[0].waypoint_order.length)
                if (d_waypoints.length) {
                    order.push({ id: d_waypoints[0].id, priority: order_count++ });
                    d_waypoints.splice(0, 1);
                }
                path = path.concat(this.formatPath(dRes));
            }
            return resolve({path: path, order: order});
        });
    }

    convertPoint(point) {
        const lng = point.lng ? point.lng : point.long ;
        return  `${point.lat}, ${lng}`;
    }

    convertMultiplePoints(points) {
        const res = [] ;
        points.forEach((point) => {
            if (point.lat !== '0' && point.long !== '0') {
                res.push({location: this.convertPoint(point), stopover: true});
            }
        });
        return res ;
    }


    formatPath(dRes) {
        if (!dRes.routes || !dRes.routes.length) { return ; }
        const path = []
        dRes.routes[0].legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                step.path.forEach((latlng) => {
                    path.push({lat: latlng.lat(), lng: latlng.lng()});
                });
            });
        });
        return path;
    }

    handleExpiredToken() {
        if (!this.invalid_keys_alerted) {
            alert('Google Maps Keys are invalid, this provider will be ignored') ;
            this.invalid_keys_alerted = true;
        }
    }


}
