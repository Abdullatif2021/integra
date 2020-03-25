export interface MapMarker {
    lat: number;
    lng: number;
    id: string;
    onDrag?: any;
    label: string;
    icon?: string;
    type?: string;
    draggable?: boolean;
    title?: string;
}
