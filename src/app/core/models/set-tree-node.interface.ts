export interface SetTreeNodeInterface {
    id?: string;
    text?: string;
    type?: string;
    parent?: SetTreeNodeInterface;
    children?: SetTreeNodeInterface[] | [{skeleton: boolean}];
    qta?: number;
    skeleton?: boolean;
    page: number;
    expanded?: boolean;
    loading?: boolean;
    setId: number;
    marker?: any;
    loaded: boolean;
    addressId?: number;
};

export interface SetClientTreeNodeInterface {
    address: string;
    arriveHour?: string;
    serviceTime?: string;
    distance?: string;
    addressId?: number;
}