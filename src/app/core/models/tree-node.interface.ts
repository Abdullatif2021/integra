export interface TreeNodeInterface {
    id?: string;
    text?: string;
    type?: string;
    parent?: TreeNodeInterface;
    children?: TreeNodeInterface[] | [{skeleton: boolean}];
    _end?: boolean;
    status?: number;
    subtype?: string;
    extra?: any;
    qta?: number;
    warning?: boolean;
    skeleton?: boolean;
    selected?: boolean;
    partiallySelected?: boolean;
    page: number;
    expanded?: boolean;
    loading?: boolean;
}

export interface TreeNodeResponseInterface {
    message: string;
    data: [{
        id: string;
        name: string;
        province_id: number;
        pivot: any;
    }] | {
        odd: any ;
        event: any ;
        other: any ;
    };
    success: boolean;
    statusCode: number;
}