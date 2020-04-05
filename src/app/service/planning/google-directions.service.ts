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

    getDirections(origin, waypoints, destination): Promise<any> {
        return new Promise<any>(async (resolve) => {
            // if (this.invalid_keys_alerted) { return resolve(null); }
            // if (!this.keys) { await this.loadKeys(); }
            origin = this.convertPoint(origin);
            destination = this.convertPoint(destination);
            waypoints = this.convertMultiplePoints(waypoints);
            const dRes = await this.sendDirectionRequest(origin, waypoints, destination).catch((e) => {
                console.log(e);
            });
            if (!dRes || dRes.status !== 'OK') {
                if (dRes && dRes.status === 'REQUEST_DENIED') {
                    this.handleExpiredToken();
                }
                return resolve(null) ;
            }
            console.log(dRes);
            const path = this.formatPath(dRes) ;
            return resolve(path);
        });
    }

    convertPoint(point) {
        return  `${point.lat}, ${point.long}`;
    }

    convertMultiplePoints(points) {
        const res = [] ;
        points.forEach((point) => {
            if (point.lat !== '0' && point.long !== '0') {
                res.push({location: this.convertPoint(point), stopover: false});
            }
        });
        return res ;
    }


    formatPath(dRes) {
        if (!dRes.routes || !dRes.routes.length) { return ; }
        const path = {
            polyline: [],
            totalTime: 0,
        };
        dRes.routes[0].legs.forEach((leg) => {
            path.totalTime += leg.duration.value ;
            leg.steps.forEach((step) => {
                step.path.forEach((latlng) => {
                    path.polyline.push({lat: latlng.lat(), lng: latlng.lng()});
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
