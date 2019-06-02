// Add Tables in here :)
// TODO add documentation for table structuring
import {ProductInterface} from '../core/models/product.interface';

export const TablesConfig = {

    // simple tables structure
    simpleTable: {
        // cities table structure
        citiesTable : {
            title: 'Paese',
            icon: 'assets/images/cityscape.svg',
            searchPlaceHolder: 'Cerca Paese',
        },
        // streets table structure
        streetsTable : {
            title: 'Strada',
            icon: 'assets/images/work-tools.svg',
            searchPlaceHolder: 'Cerca Strada'
        },
        // postmen table structure
        postmenTable : {
            title: 'Expected Postmen',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'Cerca postino previsto'
        },
    },
    // normal tables structure
    table: {
        // products listing table, used in delivering.component, in-stock.component, not-delivered.component, to-deliver.component
        productsTable : {
            cols: [
                {title: ' ', field: false, actions: [
                        {action: 'view'},
                        {action: 'book'},
                    ]},
                {title: 'BARCODE', field : 'barcode'},
                {title: 'ATTO', field : 'act_code'},
                {title: ['PRODOTTO', 'DISTINTA'], field: ['product_category', 'dispatch_code'], separator: true, value_separator: 'dashed'},
                {title: 'STATO', field: 'product_status'},
                {title: ['DATA/ORA', 'Q.TA', 'TENTATIVI'], field: ['date', 'count', 'attempt'], separator: false, value_separator: 'dashed',
                    classes: {
                        'count': 'text-center d-block',
                        'attempt': 'text-center d-block'
                    }},
                {title: ['CLIENTE', 'MITTENTE', 'DESTINARIO'], field: [
                    'customer_name',
                    'sender_name',
                    (elm: ProductInterface) => elm.recipient_name + ' - ' + elm.recipient_street + ' , ' +
                        elm.recipient_province + ' - ' + elm.recipient_cap + ' ' + elm.recipient_city
                    ], separator: false,
                    value_separator: 'line', classes: {
                        'sender_name': 'text-gray',
                        '2': 'marked'
                    }}
            ]
        },
        // preDispatchTable used in preDispatch.component
        preDispatchTable : {
            cols: [
                {title: ' ', field: false, actions: [
                        {action: 'edit', click: (elm) => { console.log('export . '); }},
                        {action: 'print', click: (elm) => { console.log('print . '); }},
                        {action: 'excel_export', click: (elm) => { console.log('export . '); }},
                        {action: 'view', click: (elm) => { console.log('call back working 1 . '); }},
                    ]},
                {title: 'PRE-DISPATCH LIST NAME', field: 'list_name', actions: []},
                {title: 'PRE-DISPATCH LIST N°', field: 'list_id', actions: []},
                {title: 'STATE / RESULT', field: 'status', actions: [
                        {action: 'view', click: (elm) => { console.log('call back working 2 . '); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ]},
                {title: 'Q.TY', field: 'qty', actions: []},
                {title: 'DATE', field: 'date', actions: []},
                {title: 'OPERATION', actions: [
                        {action: 'progress', field: 'progress'},
                        {action: 'pp', field: 'p_status', print_if: (elm) =>  elm.progress !== 100 ,
                            click: (elm) => { console.log('status should change now'); }
                        }
                    ]},
            ]
        },
        // dispatchTable used in dispatch.component
        dispatchTable : {
            cols: [
                {title: ' ', field: false, actions: [
                        {action: 'edit', click: (elm) => { console.log('export . '); }},
                        {action: 'print', click: (elm) => { console.log('print . '); }},
                        {action: 'excel_export', click: (elm) => {console.log('export . '); }},
                        {action: 'view', click: (elm) => {console.log('call back working 1 . '); }},
                    ]},
                {title: 'POSTMAN HELPER', field: 'postman', actions: []},
                {title: 'Dispatch list', field: 'distinita', actions: []},
                {title: 'STATE / RESULT', field: 'status', actions: []},
                {title: 'Q.TY', field: 'qty', actions: []},
                {title: 'DATE', field: 'date', actions: []},
                {title: 'OPERATION', actions:[
                        {action: 'progress', field: 'progress'},
                    ]},
            ]
        },
    }
} ;
