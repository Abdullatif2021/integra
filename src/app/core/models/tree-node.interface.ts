export interface TreeNodeInterface {
    id: string;
    text: string;
    type: string;
    parent: TreeNodeInterface;
    children: TreeNodeInterface[];
    _end: boolean;
    status: number;
    subtype: string;
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