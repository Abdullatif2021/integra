export interface BuildingLocationInterface {
    id: number ;
    houseNumber: string ;
    street: string ;
    cap: string;
    city: string;
    lat: number;
    long: number;
    validAddress: ValidAddressInterface;
}

export interface ValidAddressInterface {
    indirizzo: string;
    civico: string;
    spec: string;
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