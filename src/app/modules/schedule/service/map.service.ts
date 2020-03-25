import {EventEmitter, Injectable} from '@angular/core';
import {MapMarker} from '../../../core/models/map-marker.interface';

@Injectable()
export class MapService {

    constructor() {
    }

    mapLocation = {
        center: {
            lat: 40.8440337,
            lng: 14.3435834
        },
        zoom: 11
    }
    markers = <MapMarker[]>[];
    onClickCallBack: any;
    markersChanges = new EventEmitter<MapMarker[]>();
    moved = new EventEmitter();

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
            const marker = <MapMarker>{
                lat: elm.lat,
                lng: elm.long,
                label: elm.name,
                id: elm.id ? elm.id : Math.random().toString(36).substr(2, 6),
                icon: null,
                type: elm.type,
                draggable: true,
                cluster: true
            } ;
            marker.onDrag = (event) => {
                if (typeof onDrag === 'function') {
                    onDrag(event, marker);
                }
            },
            this.markers.push(marker);
        });
        this.markersChanges.emit(this.markers);
    }

    reset() {
        this.markers = [];
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

    move(type, val) {
        this.mapLocation[type] = val ;
        this.moved.emit(this.mapLocation);
    }

    mapClicked(event) {
        if (typeof this.onClickCallBack === 'function') {
            this.onClickCallBack(event);
        }
    }


}

