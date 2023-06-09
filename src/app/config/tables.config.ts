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
            text: 'name',
            all_label: 'Tutti',
        },
        // streets table structure
        streetsTable: {
            title: 'Strada',
            icon: 'assets/images/work-tools.svg',
            searchPlaceHolder: 'Cerca Strada',
            order: '1',
            text: 'name',
            all_label: 'Tutte',
            actions: [
                {action: 'rename', label: 'Cambia nome', hide: (item) => item.is_fixed}
            ],
            styles: {
                'background-color': (item, idx) => item.is_fixed ? null : (idx % 2 ? '#ff00008f' : '#ff000066')
            }
        },
        // postmen table structure
        postmenTable: {
            title: 'Expected Postmen',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'Cerca postino previsto',
            text: 'full_name'
        },
        customPostmenTable: {
            custom: true,
            title: 'Postmen',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'Cerca postino previsto',
            text: 'full_name'
        },
        reviserTable: {
            custom: true,
            title: 'Revisori',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'Cerca postino previsto',
            text: 'full_name'
        },
        dispatch: {
            custom: true,
            title: 'Distinte',
            icon: 'assets/images/dispatch-icon.svg',
            searchPlaceHolder: 'Cerca distinte',
            text: 'pre_dispatch_code',
            extra_fields: [
                {label: '', value: (row) => row.started_at.substr(0, 10)},
                {label: 'Q.ta', value: (row) => row.quantity + ' prodotti'}
            ]
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
                {title: 'Azioni', field: false, actions: [
                        {action: 'view'},
                        {action: 'book'},
                    ]},
                {title: 'BARCODE', field : 'barcode', order: '2'},
                {title: 'ATTO', field : 'act_code', order: '1'},
                {title: ['PRODOTTO', 'DISTINTA'], field: ['product_category', 'dispatch_code'], separator: true, value_separator: 'dashed',
                    order: ['7', '3']},
                {title: 'STATO', field: 'product_status', order: '8'},
                {title: ['DATA/ORA', 'Q.TA', 'TENTATIVI'], field: [
                        'date',
                        (elm: ProductInterface) => (elm.count === '') || !elm.count ? '1' : elm.count,
                        'attempt'
                    ], separator: false, value_separator: 'dashed',
                    classes: {
                        '1': 'text-center d-block',
                        'attempt': 'text-center d-block'
                    }, order: ['4', '5', '6']},
                {title: ['CLIENTE', 'MITTENTE', 'DESTINARIO'], field: [
                    'customer_name',
                    'sender_name',
                    (elm: ProductInterface) => `<b>${elm.recipient_name}</b> - ${elm.recipient_street},
                        ${elm.recipient_house_number}, ${elm.recipient_cap} ${elm.recipient_city}`
                    ], separator: false,
                    value_separator: 'line', classes: {
                        'sender_name': 'text-gray',
                        '2': 'marked'
                    }, order: ['9', '10', '11']}
            ]
        },
        // preDispatchTable used in preDispatch.component
        preDispatchTable : {
            cols: [
                {title: 'Azioni', field: false, actions: [
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
                {title: 'STATO / ESITO', field: (item, container) => container.getTranslatedState(item), actions: [
                        {action: 'view', click: (elm, container) => { container.showLogModal(elm); },
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
                {label: 'Aggiungi Prodotti', _class: 'orange-btn', click: (elm, container) => {container.openAddProductsModal(elm)}},
                {label: 'Elimina', _class: 'red-btn', click: (elm, container) => {
                    container.openModal(PreDispatchDeleteComponent, {deleteItem: true, item: elm}) ;
                }}
            ]
        },
        // dispatchTable used in dispatch.component
        dispatchTable : {
            cols: [
                {title: 'Azioni', field: false, actions: [
                        {action: 'edit', click: (elm) => { console.log('export . '); }},
                        {action: 'print', click: (elm) => { console.log('print . '); }},
                        {action: 'excel_export', click: (elm) => {console.log('export . '); }},
                        {action: 'view', click: (elm, container) => { container.showDispatchModal(elm); }},
                        {action: 'calender_view', click: (elm, container) => {container.goToCalender(elm)}}
                    ]},
                {title: 'Nome', field: 'name', actions: [], order: '1'},
                {title: '', field: [], actions: []},
                {title: ['Postino', 'CSPI'], field: [(elm) => elm.postman ? elm.postman.full_name : 'Not Assigned',
                        (elm) => elm.user ? elm.user.full_name : ''  ], separator: true, value_separator: 'dashed',
                        actions: [], order: ['6', '7']},
                {title: ['Stato distinta', 'Distinta'], field: [(elm) => {
                        switch (elm.status) {
                            case 'not_prepare': return 'Borsa non preparata';
                            case 'not_assigned': return 'Non assegnato ';
                            case 'prepared': return 'Borsa preparata';
                            default: return elm.status;
                        }
                    }, 'pre_dispatch_code'], actions: [
                        {action: 'view', click: (elm, container) => { container.showLogModal(elm); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ], order: ['2', '8'], separator: true, value_separator: 'dashed',},
                {title: 'Q.tà', field: 'quantity', actions: [], order: '5'},
                {title: ['Data inizio consegna', 'Data creazione'], field: ['started_at', 'created_at'], actions: [],
                    order: ['3'], separator: true, value_separator: 'dashed'},
                {title: 'Nota', field: 'note', actions: [], order: '9'},
                // {title: 'OPERATION', actions: [
                //         { action: 'progress',  field: 'percent',},
                //     ]},
            ]
        },
        // dispatchTable used in dispatch.component
        deliveringTable : {
            cols: [
                {title: 'Azioni', field: false, actions: [
                        {action: 'edit', click: (elm) => { console.log('export . '); }},
                        {action: 'print', click: (elm) => { console.log('print . '); }},
                        {action: 'excel_export', click: (elm) => {console.log('export . '); }},
                        {action: 'view', click: (elm, container) => { container.showDispatchModal(elm); }},
                        {action: 'calender_view', click: (elm, container) => {container.goToCalender(elm)}}
                    ]},
                {title: 'Nome', field: 'name', actions: [], order: '1'},
                {title: '', field: [], actions: []},
                {title: ['Postino', 'CSPI'], field: [(elm) => elm.postman ? elm.postman.full_name : 'Not Assigned',
                        (elm) => elm.user ? elm.user.full_name : ''  ], separator: true, value_separator: 'dashed',
                    actions: [], order: ['6', '7']},
                {title: ['Stato distinta', 'Distinta'], field: [(elm) => {
                        switch (elm.status) {
                            case 'not_prepare': return 'Borsa non preparata';
                            case 'not_assigned': return 'Non assegnato ';
                            case 'prepared': return 'Borsa preparata';
                            default: return elm.status;
                        }
                    }, 'pre_dispatch_code'], actions: [
                        {action: 'view', click: (elm, container) => { container.showLogModal(elm); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ], order: ['2', '8'], separator: true, value_separator: 'dashed',},
                {title: 'Q.tà', field: 'quantity', actions: [], order: '5'},
                {title: ['Data inizio consegna', 'Data creazione'], field: ['started_at', 'created_at'], actions: [],
                    order: ['3'], separator: true, value_separator: 'dashed'},
                {title: 'Nota', field: 'note', actions: [], order: '9'},
                // {title: 'OPERATION', actions: [
                //         { action: 'progress',  field: 'percent',},
                //     ]},
            ]
        },
    }
} ;
