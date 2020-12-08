import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GoogleApiService} from '../../shared/service/google.api.service';

@Injectable()
export class GoogleDirectionsService {

    constructor(
        private http: HttpClient,
        private googleApiService: GoogleApiService
    ) {
    }

    sendDirectionRequest(origin, waypoints, destination): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const directionsService = new (<any>window).google.maps.DirectionsService;
            let done = false ;
            directionsService.route({
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function(response, status) {
                done = true ;
                if (status === 'OK') {
                    return resolve(response);
                }
                return reject(status);
            });
            setTimeout(() => {if (!done) {reject('REQUEST_LOCALLY_IGNORED'); }}, 7000);
        });
    }

    clearWaypoints(waypoints) {
        return waypoints.filter((elm) => elm.lat !== '0' && elm.long !== '0');
    }

    async getDirections(origin, waypoints, destination): Promise<any> {
        let path = [] ;
        const order = [] ;
        let order_count = 0;
        waypoints = this.clearWaypoints(waypoints);
        const d_waypoints = [...waypoints] ;
        while (waypoints.length) {
            let error = null ;
            const dRes = await this.sendDirectionRequest(
                this.convertPoint(path.length ? path[path.length - 1] : origin),
                this.convertMultiplePoints(waypoints.splice(0, 25)),
                this.convertPoint(waypoints.length ? waypoints.splice(0, 1)[0] : destination)
            ).catch((e) => { error = e; });
            if (!dRes || dRes.status !== 'OK') {
                if ((dRes && dRes.status === 'REQUEST_DENIED') || error === 'REQUEST_DENIED' || error === 'REQUEST_LOCALLY_IGNORED') {
                    // change the key then try all over again.
                    if (await this.googleApiService.loadJsUsingNextKey()) {
                        console.log('returning here');
                        return await this.getDirections(origin, waypoints, destination);
                    }
                    this.handleExpiredToken();
                }
                console.log('returning here donna why', error, dRes);
                return false ;
            }

            // every thing is ok, format the output and add it the the final output.
            dRes.routes[0].waypoint_order.forEach((idx) => {
                order.push({ id: d_waypoints[idx].id, priority: order_count++ });
            });
            d_waypoints.splice(0, dRes.routes[0].waypoint_order.length);
            if (d_waypoints.length) {
                order.push({ id: d_waypoints[0].id, priority: order_count++ });
                d_waypoints.splice(0, 1);
            }
            path = path.concat(this.formatPath(dRes));
        }
        console.log('returning result');
        // return the result.
        return {path: path, order: order};
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
        const path = [];
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
        // stop the operation.
    }


}
