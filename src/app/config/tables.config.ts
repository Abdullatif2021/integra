// Add Tables in here :)
// TODO add documentation for table structuring
import {ProductInterface} from '../core/models/product.interface';
import {AppConfig} from './app.config';
import {PreDispatchEditComponent} from '../modules/home/modals/pre-dispatch-edit/pre-dispatch-edit.component';
import {PreDispatchDeleteComponent} from '../modules/home/modals/pre-dispatch-delete/pre-dispatch-delete.component';

export const TablesConfig = {

    // simple tables structure
    simpleTable: {
        // cities table structure
        citiesTable: {
            title: 'Paese',
            icon: 'assets/images/cityscape.svg',
            searchPlaceHolder: 'Cerca Paese',
            order: '1',
            text: 'name'
        },
        // streets table structure
        streetsTable: {
            title: 'Strada',
            icon: 'assets/images/work-tools.svg',
            searchPlaceHolder: 'Cerca Strada',
            order: '1',
            text: 'name',
        },
        // postmen table structure
        postmenTable: {
            title: 'Expected Postmen',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'Cerca postino previsto',
            text: 'full_name'
        },
        settingsTable: {
            custom: true,
            title: 'Impostazioni',
            icon: false,
            searchPlaceHolder: 'Cerca',
            searchMethod: (items, term) => {
                return items.filter((elm) => {
                    return elm.name.toLowerCase().indexOf(term.toLowerCase()) !== -1;
                });
            },
            text: 'name',
        },
        subSettingsTable: {
            custom: true,
            title: 'Map Provider',
            icon: false,
            searchPlaceHolder: 'Cerca',
            searchMethod: (items, term) => {
                return items.filter((elm) => {
                    return elm.name.toLowerCase().indexOf(term.toLowerCase()) !== -1;
                });
            },
            text: 'name',
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
                {title: 'BARCODE', field : 'barcode', order: '2'},
                {title: 'ATTO', field : 'act_code', order: '1'},
                {title: ['PRODOTTO', 'DISTINTA'], field: ['product_category', 'dispatch_code'], separator: true, value_separator: 'dashed'},
                {title: 'STATO', field: 'product_status'},
                {title: ['DATA/ORA', 'Q.TA', 'TENTATIVI'], field: [
                        'date',
                        (elm: ProductInterface) => (elm.count === '') || !elm.count ? '1' : elm.count,
                        'attempt'
                    ], separator: false, value_separator: 'dashed',
                    classes: {
                        '1': 'text-center d-block',
                        'attempt': 'text-center d-block'
                    }},
                {title: ['CLIENTE', 'MITTENTE', 'DESTINARIO'], field: [
                    'customer_name',
                    'sender_name',
                    (elm: ProductInterface) => `<b>${elm.recipient_name}</b> - ${elm.recipient_street},
                        ${elm.recipient_house_number}, ${elm.recipient_cap} ${elm.recipient_city}`
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
                        {action: 'more'},
                        {action: 'edit', click: (elm, container) => {
                            container.openModal(PreDispatchEditComponent, elm) ;
                        }},
                        {action: 'print', click: (elm) => { console.log('print . '); }},
                        {action: 'excel_export', click: (elm) => {
                            window.open(AppConfig.endpoints.exportPreDispatches + '?pre_dispatch_id=' + elm.id);
                        }},
                        {action: 'view', click: (elm, container) => {
                            container.integraaModalService.open('/pages/pre-dispatch/' + elm.id + '/products', {width: 1250, height: 650});
                        }},
                        {action: 'pDelete', print_if: (item, container) => {
                                return !container.backProcessingService.isRunningAny(item.id) &&
                                    item.localize_status === 'pause'},
                            click: (item, container) => {
                                container.openModal(PreDispatchDeleteComponent, {deleteItem: true, item: item}) ;
                            }
                        }
                    ]},
                {title: 'NOME DISTINTA', field: 'name', actions: [], order: '1'},
                {title: 'DISTINTA', field: 'code', actions: [], order: '4'},
                {title: 'STATO / ESITO', field: 'status', actions: [
                        {action: 'view', click: (elm) => { console.log('call back working 2 . '); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ], order: '3'},
                {title: 'Q.TA’', field: 'quantity', actions: [], order: '2'},
                {title: 'DATA', field: 'creation_date', actions: [], order: '5'},
                {title: 'OPERAZIONE', actions: [
                        {
                            action: 'progress',
                            field: 'percent',
                            status: (item) => {
                                return item.percent === 100 && item.status === 'in_localize' ? 'progress-error' : 'progress-ok';
                            }
                        },
                        {action: 'pPlay', field: 'p_status', print_if: (item, container) => {
                                return !container.backProcessingService.isRunningAny(item.id) &&
                                    item.localize_status === 'pause' &&
                                    container.preDispatchGlobalActionsService.isPreDispatchInRunStatus(item);
                            },
                            click: (item, container) => {
                                container.preDispatchGlobalActionsService.startPreDispatchAction(item);
                            }
                        },
                        {action: 'pPause', field: 'p_status', print_if: (item, container) => {
                                return (container.backProcessingService.isRunning('locating-' + item.id) ||
                                    item.localize_status === 'play');
                            },
                            click: (item, container) => {
                                item.localize_status = 'pause';
                                container.backProcessingService.ultimatePause(item.id);
                            }
                        },
                    ]},
            ],
            collapsedActions: [
                {label: 'Pianifica', _class: 'green-btn', click: (elm, container) => {
                    container.openIntegraaModal(elm);
                    // container.router.navigate(['/schedule', elm.id]);
                    }},
                {label: 'Metti in Consegna', _class: 'yellow-btn', click: (elm, container) => {console.log('clicked') ; }},
                {label: 'Aggiungi Prodotti', _class: 'orange-btn', click: (elm, container) => {console.log('clicked') ; }},
                {label: 'Elimina', _class: 'red-btn', click: (elm, container) => {
                    container.openModal(PreDispatchDeleteComponent, {deleteItem: true, item: elm}) ;
                }}
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
                {title: 'POSTMAN', field: [(elm) => elm.postman ? elm.postman.full_name : 'Not Assigned' ], actions: []},
                {title: 'Dispatch list', field: 'pre_dispatch_code', actions: []},
                {title: 'STATE / RESULT', field: 'status', actions: []},
                {title: 'Q.TY', field: 'quantity', actions: []},
                {title: 'DATE', field: 'started_at', actions: []},
                {title: 'OPERATION', actions: [
                        { action: 'progress',  field: 'percent',},
                    ]},
            ]
        },
    }
} ;
