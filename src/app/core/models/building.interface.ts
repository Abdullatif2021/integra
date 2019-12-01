export interface BuildingLocationInterface {
    id: number ;
    houseNumber: string ;
    street: string ;
    cap: string;
    city: string;
    lat: number;
    long: number;
}

export interface LocatedBuildingInterface {
    id: number;
    lat?: number;
    long?: number;
    is_fixed: boolean;
    name?: string;
    formattedAddress?: FormattedAddress;
}

export interface FormattedAddress {
    city: string;
    cap: number;
    houseNumber: string;
    country: string;
    street: string;
}