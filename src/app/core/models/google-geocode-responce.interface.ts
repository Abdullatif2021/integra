export interface GoogleGeocodeResponseInterface {
    status: String;
    results: {
        address_components: any ;
        formatted_address: string ;
        geometry: {
            bounds: any ;
            location: {
                lat: string,
                lng: string
            };
            location_type: string ;
            viewport: any ;
        } ;
        place_id: string ;
        types: [string] ;
    } ;
}
