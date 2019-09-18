export interface MapBoxGeocodeResponceInterface {
    type: string;
    query: [string];
    features: [{
        id: string;
        type: string;
        place_type: [string];
        relevance: number;
        properties: {accuracy: string};
        text: string;
        place_name: string;
        center: [number];
        geometry: {
            type: string;
            coordinates: [number];
        }
        context: [{
            id: string;
            text: string;
        }]
    }];
    attribution: string;
}
