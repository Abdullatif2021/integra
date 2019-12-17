import {EventEmitter, Injectable} from '@angular/core';
import {MapMarker} from '../../../core/models/map-marker.interface';

@Injectable()
export class MapService {

    constructor() {
    }

    markers = <MapMarker[]>[];
    onClickCallBack: any;
    markersChanges = new EventEmitter<MapMarker[]>();
    createMarker(id = null, lat, lng, label = '', onDrag = null): MapMarker {
        const marker = <MapMarker>{
            lat: lat,
            lng: lng,
            label: label,
            id: id ? id : Math.random().toString(36).substr(2, 6),
            onDrag: onDrag
        } ;
        this.markers.push(marker);
        this.markersChanges.emit(this.markers);
        return marker ;
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

    mapClicked(event) {
        if (typeof this.onClickCallBack === 'function') {
            this.onClickCallBack(event);
        }
    }


}

