import {MarkerLabel} from '@agm/core';

export interface MapMarker {
    lat: number;
    lng: number;
    id: string;
    onDrag?: any;
    label: string | MarkerLabel;
    icon?: string;
    type?: string;
    draggable?: boolean;
    title?: string;
    onClick?: any;
    cluster?: boolean;
    count?:  string | MarkerLabel;
    count_marker?: any;
    infoWindow?: any;
}
