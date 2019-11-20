export interface ACAddress {
    id?: number;
    text: string;
    located?: boolean;
    hasObject?: boolean;
    address: {
        city: string;
        cap?: number;
        street: string;
        houseNumber?: string;
        strict?: boolean;
        lat?: number;
        lng?: number;
    };
};