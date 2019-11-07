export interface RecipientInterface {
    id: number ;
    name: string ;
}
export interface RecipientLocationInterface {
    id: number ;
    houseNumber: string ;
    street: string ;
    cap: string;
    city: string;
    lat: number;
    long: number;
}

export interface LocatedRecipientInterface {
    id: number;
    lat?: number;
    long?: number;
    is_fixed: boolean;
    name?: string;
}