import {EventEmitter, Injectable} from '@angular/core';
import {MapMarker} from '../../../core/models/map-marker.interface';
import {MarkersService} from './markers.service';
import {SymbolPath} from '@agm/core/services/google-maps-types';

@Injectable()
export class MapService {

    constructor(
        private markersService: MarkersService,
    ) {
    }

    mapLocation = <any>{
        center: {
            lat: 40.8440337,
            lng: 14.3435834
        },
        zoom: 11
    }
    markers = <MapMarker[]>[];
    onClickCallBack: any;
    markersChanges = new EventEmitter<MapMarker[]>();
    pathsChanges = new EventEmitter<MapMarker[]>();
    moved = new EventEmitter<any>();
    mapMoved = new EventEmitter<any>();
    pathes = [] ;

    createMarker(id = null, lat, lng, label = '', onDrag = null, icon = null, type = null, draggable = false, cluster = null ): MapMarker {
        const marker = <MapMarker>{
            lat: lat,
            lng: lng,
            label: label,
            id: id ? id : Math.random().toString(36).substr(2, 6),
            onDrag: onDrag,
            icon: icon,
            type: type,
            draggable: draggable,
            cluster: cluster
        } ;
        this.markers.push(marker);
        this.markersChanges.emit(this.markers);
        return marker ;
    }

    createMarkersList(list, onDrag = null) {
        if (!list) { return; }
        list.forEach((elm) => {
            const m = this.markersService.getMarker(elm) ;
            const marker = <MapMarker>{
                lat: elm.lat,
                lng: elm.long,
                label: m.text,
                title: elm.name,
                id: elm.id ? elm.id : Math.random().toString(36).substr(2, 6),
                icon: this.getMarkerImage(elm.type, m.color),
                type: elm.type,
                draggable: elm.type === 'Product',
                cluster: elm.type !== 'Product',
            };
            this.addCountLabel(marker, elm);
            this.addInfoWindow(marker, elm);
            marker.onDrag = (event) => {
                if (typeof onDrag === 'function') {
                    onDrag(event, marker);
                }
            };
            marker.onClick = (event) => {
                switch (marker.type) {
                    case 'Region': this.moveMapTo(elm.lat, elm.long, 10); break ;
                    case 'City': this.moveMapTo(elm.lat, elm.long, 13); break ;
                    case 'Cap': this.moveMapTo(elm.lat, elm.long, 14); break ;
                    case 'Street': this.moveMapTo(elm.lat, elm.long, 16); break ;
                }
                if (marker.infoWindow) {
                    marker.infoWindow.isOpen = !marker.infoWindow.isOpen;
                }
            }
            this.markers.push(marker);
        });
        this.markersChanges.emit(this.markers);
    }

    reset() {
        this.markers = [];
        this.markersChanges.emit(this.markers);
    }

    drawPath(path) {
        this.pathes = [path];
        this.pathsChanges.emit(this.pathes);
    }

    addInfoWindow(marker, elm) {
        if (marker.type !== 'Product') {
            return ;
        }
        let text = '';
        if (!elm.markerProducts) {
            text = 'No Products.';
        }
        console.log('shit', elm.markerProducts)
        elm.markerProducts.forEach((product) => {
            text += `<div class='info-window-product-act-row'>${product.act_code}</div>`;
            console.log(text);
        })
        marker.infoWindow = {
          text: text,
          isOpen: false
        };
    }
    addCountLabel(marker, elm) {
        if (marker.type === 'Product') {
            return ;
        }
        marker.count = {
            text: elm.productCount + '',
                fontSize: '8px'
        },
        marker.count_marker = {
            path: SymbolPath.CIRCLE,
                anchor: {x: -2, y: 4},
            scale: 8,
                fillColor: '#fcda4b',
                color: '#FFF',
                strokeWeight: 1,
                fillOpacity: 1,
        };
    }

    removeMarker(marker: MapMarker | string) {
        this.markers = this.markers.filter((elm) => elm.id !== (typeof marker === 'string' ? marker : marker.id));
        this.markersChanges.emit(this.markers);
    }

    getMarker(id): MapMarker {
        const result = this.markers.filter((elm) => elm.id === id);
        return result ? result[0] : null;
    }

    onClick(callback) {
        this.onClickCallBack = callback;
    }

    // the user had moved in the map
    move(lat, lng, zoom) {
        this.mapLocation.center.lat = lat;
        this.mapLocation.center.lng = lng;
        this.mapLocation.zoom = zoom;
        this.moved.emit(this.mapLocation);
    }

    // forces map to move to a location
    moveMapTo(lat, lng, zoom) {
        this.mapMoved.emit({
            center: {
                lat: lat,
                lng: lng
            },
            zoom: zoom
        });
    }

    mapClicked(event) {
        if (typeof this.onClickCallBack === 'function') {
            this.onClickCallBack(event);
        }
    }

    resetLocation() {
        this.mapLocation = {
            center: {
                lat: 40.8440337,
                lng: 14.3435834
            },
            zoom: 11
        };
    }

    getMarkerImage(type, color) {
        const size = '42' ;
        let encoded ;
        if (type === 'Product') {
            encoded = window.btoa('' +
                '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" ' +
                'xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="' + size + '" height="' + size + '"' +
                ' viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve"> <g>' +
                '<path fill="' + color + '" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.' +
                '1-88.8-186.7-175.4-186.9 \tC96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,' +
                '551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8' +
                '\tc33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/></g></svg>');
        } else {
            encoded = window.btoa('' +
                '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg" ' +
                'xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200">' +
                '<defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/>' +
                '<path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/>' +
                '<path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g>' +
                '</defs><g fill="' + color + '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)">' +
                '<use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>');
        }

        return ('data:image/svg+xml;base64,' + encoded);
    }
}

