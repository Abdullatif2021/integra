// not used for now
export interface StreetInterface {
    id: number ;
    name: string ;
    count: number ;
    lat: number;
    long: number;
    isFixed: boolean;
    cap: {
        id: number;
        name: string
    };
    city: {
        id: number;
        name: string;
        province_id: number
    };
}
