import { TranslateService } from '@ngx-translate/core';
// Add Tables in here :)
// TODO add documentation for table structuring
import {ProductInterface} from '../core/models/product.interface';
import {AppConfig} from './app.config';
import {PreDispatchEditComponent} from '../modules/home/modals/pre-dispatch-edit/pre-dispatch-edit.component';
import {PreDispatchDeleteComponent} from '../modules/home/modals/pre-dispatch-delete/pre-dispatch-delete.component';
import {OwnTranslateService} from 'src/app/service/translate.service';

export const TablesConfig = {

    // simple tables structure
    simpleTable: {
        // cities table structure
        citiesTable: {
            title: 'table_config.simpletable.cities_table.value',
            icon: 'assets/images/cityscape.svg',
            searchPlaceHolder: 'table_config.simpletable.cities_table.plhold',
            order: '1',
            text: 'name',
            all_label: 'Tutti',
        },
        // streets table structure
        streetsTable: {
            title: 'table_config.simpletable.streets_table.value',
            icon: 'assets/images/work-tools.svg',
            searchPlaceHolder: 'table_config.simpletable.streets_table.plhold',
            order: '1',
            text: 'name',
            all_label: 'Tutte',
            actions: [
                {action: 'rename', label: 'table_config.simpletable.streets_table.action', hide: (item) => item.is_fixed}
            ],
            styles: {
                'background-color': (item, idx) => item.is_fixed ? null : (idx % 2 ? '#ff00008f' : '#ff000066')
            }
        },
        // postmen table structure
        postmenTable: {
            title: 'table_config.simpletable.postmen_table.value',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'table_config.simpletable.postmen_table.plhold',
            text: 'full_name'
        },
        customPostmenTable: {
            custom: true,
            title: 'table_config.simpletable.custom_postmen_table.value',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'table_config.simpletable.custom_postmen_table.plhold',
            text: 'full_name'
        },
        reviserTable: {
            custom: true,
            title: 'table_config.simpletable.reviser_table.value',
            icon: 'assets/images/postman-icon.png',
            searchPlaceHolder: 'table_config.simpletable.reviser_table.plhold',
            text: 'full_name'
        },
        dispatch: {
            custom: true,
            title: 'table_config.simpletable.dispatch.value',
            icon: 'assets/images/dispatch-icon.svg',
            searchPlaceHolder: 'table_config.simpletable.dispatch.plhold',
            text: 'pre_dispatch_code',
            extra_fields: [
                {label: 'table_config.simpletable.dispatch.extra_fields.val1', value: (row) => row.started_at.substr(0, 10)},
                {label: 'table_config.simpletable.dispatch.extra_fields.val2', value: (row) => row.quantity + ' prodotti'}
            ]
        },
        settingsTable: {
            custom: true,
            title: 'table_config.simpletable.settings_table.value',
            icon: false,
            searchPlaceHolder: 'table_config.simpletable.settings_table.plhold',
            searchMethod: (items, term) => {
                return items.filter((elm) => {
                    return elm.name.toLowerCase().indexOf(term.toLowerCase()) !== -1;
                });
            },
            text: 'name',
        },
        subSettingsTable: {
            custom: true,
            title: 'table_config.simpletable.sub_settings_table.value',
            icon: false,
            searchPlaceHolder: 'table_config.simpletable.sub_settings_table.plhold',
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
                {title: 'table_config.table.products_table.cols.action', field: false, actions: [
                                {action: 'view'},
                                {action: 'book'},
                    ]},
                {title: 'table_config.table.products_table.cols.bar_code', field : 'barcode', order: '2'},
                {title: 'table_config.table.products_table.cols.act', field : 'act_code', order: '1'},
                {title: ['table_config.table.products_table.cols.product_list.product', 
                'table_config.table.products_table.cols.product_list.list'],
                 field: ['product_category', 'dispatch_code'], separator: true, value_separator: 'dashed',
                    order: ['7', '3']},
                {title: 'table_config.table.products_table.cols.status', field: 'product_status', order: '8'},
                {title: ['table_config.table.products_table.cols.data.data_time', 'table_config.table.products_table.cols.data.quanti',
                 'table_config.table.products_table.cols.data.attempts'], field: [
                        'date',
                        (elm: ProductInterface) => (elm.count === '') || !elm.count ? '1' : elm.count,
                        'attempt'
                    ], separator: false, value_separator: 'dashed',
                    classes: {
                        '1': 'text-center d-block',
                        'attempt': 'text-center d-block'
                    }, order: ['4', '5', '6']},
                {title: ['table_config.table.products_table.cols.postman.cust', 'table_config.table.products_table.cols.postman.sender',
                 'table_config.table.products_table.cols.postman.recipient'], field: [
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
                {title: 'table_config.table.pre_dispatch_table.cols.action', field: false, actions: [
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
                {title: 'table_config.table.pre_dispatch_table.cols.name_distinct', field: 'name', actions: [], order: '1'},
                {title: 'table_config.table.pre_dispatch_table.cols.distincta', field: 'code', actions: [], order: '4'},
                {title: 'table_config.table.pre_dispatch_table.cols.stat_outcome',
                 field: (item, container) => container.getTranslatedState(item), actions: [
                    {action: 'view', click: (elm, container) => { container.showLogModal(elm); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ], order: '3'},
                {title: 'table_config.table.pre_dispatch_table.cols.quint', field: 'quantity', actions: [], order: '2'},
                {title: 'table_config.table.pre_dispatch_table.cols.data', field: 'creation_date', actions: [], order: '5'},
                {title: 'table_config.table.pre_dispatch_table.cols.opera', actions: [
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
                        {action: 'pPlay',field: 'p_status', print_if: (item, container) => {
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
                {label: 'table_config.table.pre_dispatch_table.collapsed_actions.Plan', _class: 'green-btn', click: (elm, container) => {
                    container.openIntegraaModal(elm);
                    // container.router.navigate(['/schedule', elm.id]);
                    }},
                {label: 'table_config.table.pre_dispatch_table.collapsed_actions.place_in_delivery',
                 _class: 'yellow-btn', click: (elm, container) => {console.log('clicked') ; }},
                {label: 'table_config.table.pre_dispatch_table.collapsed_actions.add_products',
                 _class: 'orange-btn', click: (elm, container) => {container.openAddProductsModal(elm)}},
                {label: 'table_config.table.pre_dispatch_table.collapsed_actions.delete', _class: 'red-btn', click: (elm, container) => {
                    container.openModal(PreDispatchDeleteComponent, {deleteItem: true, item: elm}) ;
                }}
            ]
        },
        // dispatchTable used in dispatch.component
        dispatchTable : {
            cols: [
                {title: 'table_config.table.dispatch_table.cols.action', field: false, actions: [
                    {action: 'edit', click: (elm) => { console.log('export . '); }},
                    {action: 'print', click: (elm) => { console.log('print . '); }},
                    {action: 'excel_export', click: (elm) => {console.log('export . '); }},
                    {action: 'view', click: (elm, container) => { container.showDispatchModal(elm); }},
                    {action: 'calender_view', click: (elm, container) => {container.goToCalender(elm)}}
                ]},
                {title: 'table_config.table.dispatch_table.cols.name', field: 'name', actions: [], order: '1'},
                {title: 'table_config.table.dispatch_table.cols.empty', field: [], actions: []},
                {title: ['table_config.table.dispatch_table.cols.post_cspi.postman',
                 'table_config.table.dispatch_table.cols.post_cspi.cspi'],
                 field: [(elm) => elm.postman ? elm.postman.full_name : 'Not Assigned',
                        (elm) => elm.user ? elm.user.full_name : ''  ], separator: true, value_separator: 'dashed',
                        actions: [], order: ['6', '7']},
                {title: ['table_config.table.dispatch_table.cols.state_distinct.state',
                 'table_config.table.dispatch_table.cols.state_distinct.distinct'], field: [(elm) => {
                        switch (elm.status) {
                            case 'not_prepare': return 'table_config.table.dispatch_table.cols.state_distinct.not_prepare';
                            case 'not_assigned': return 'table_config.table.dispatch_table.cols.state_distinct.not_assigned ';
                            case 'prepared': return 'table_config.table.dispatch_table.cols.state_distinct.prepared';
                            default: return elm.status;
                        }
                    }, 'pre_dispatch_code'], actions: [
                        {action: 'View',click: (elm, container) => { container.showLogModal(elm); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ], order: ['2', '8'], separator: true, value_separator: 'dashed',},
                {title: 'table_config.table.dispatch_table.cols.quint', field: 'quantity', actions: [], order: '5'},
                {title: ['table_config.table.dispatch_table.cols.delivery_start_date.t1',
                 'table_config.table.dispatch_table.cols.delivery_start_date.t2'], field: ['started_at', 'created_at'], actions: [],
                    order: ['3'], separator: true, value_separator: 'dashed'},
                {title: 'table_config.table.dispatch_table.cols.note', field: 'note', actions: [], order: '9'},
                // {title: 'OPERATION', actions: [
                //         { action: 'progress',  field: 'percent',},
                //     ]},
            ]
        },
        // dispatchTable used in dispatch.component
        deliveringTable : {
            cols: [
                {title: 'table_config.table.delivering_table.cols.action', field: false, actions: [
                        {action: 'edit', click: (elm) => { console.log('export . '); }},
                        {action: 'print', click: (elm) => { console.log('print . '); }},
                        {action: 'excel_export', click: (elm) => {console.log('export . '); }},
                        {action: 'view', click: (elm, container) => { container.showDispatchModal(elm); }},
                        {action: 'calender_view', click: (elm, container) => {container.goToCalender(elm)}}
                    ]},
                {title: 'table_config.table.delivering_table.cols.name', field: 'name', actions: [], order: '1'},
                {title: 'table_config.table.delivering_table.cols.empty', field: [], actions: []},
                {title: ['table_config.table.delivering_table.cols.post_cspi.postman',
                 'table_config.table.delivering_table.cols.post_cspi.cspi'], 
                 field: [(elm) => elm.postman ? elm.postman.full_name : 'Not Assigned',
                        (elm) => elm.user ? elm.user.full_name : ''  ], separator: true, value_separator: 'dashed',
                    actions: [], order: ['6', '7']},
                    {title: ['table_config.table.delivering_table.cols.state_distinct.state',
                    'table_config.table.delivering_table.cols.state_distinct.distinct'], field: [(elm) => {
                           switch (elm.status) {
                               case 'not_prepare': return 'table_config.table.delivering_table.cols.state_distinct.not_prepare';
                               case 'not_assigned': return 'table_config.table.delivering_table.cols.state_distinct.not_assigned ';
                               case 'prepared': return 'table_config.table.delivering_table.cols.state_distinct.prepared';
                               default: return elm.status;
                           }
                    }, 'pre_dispatch_code'], actions: [
                        {action: 'view', click: (elm, container) => { container.showLogModal(elm); },
                            _class: ['float-right', 'mt-0', 'mr-2']}
                    ], order: ['2', '8'], separator: true, value_separator: 'dashed', },
                    {title: 'table_config.table.delivering_table.cols.quint', field: 'quantity', actions: [], order: '5'},
                    {title: ['table_config.table.delivering_table.cols.delivery_start_date.t1',
                     'table_config.table.delivering_table.cols.delivery_start_date.t2'], field: ['started_at', 'created_at'], actions: [],
                        order: ['3'], separator: true, value_separator: 'dashed'},
                    {title: 'table_config.table.delivering_table.cols.note', field: 'note', actions: [], order: '9'},
                // {title: 'OPERATION', actions: [
                //         { action: 'progress',  field: 'percent',},
                //     ]},
            ]
        },
    }
} ;
