
export const FilterConfig = {
    products: {
        search: (container, sp) => [
        {type: 'ng-select', label: 'filter_config.products.search.client', key: 'customerId',
         items:  sp.filters_data.customers, labelVal: 'name'},
            {type: 'text', label: 'filter_config.products.search.client_name', key: 'customerName'},
            {type: 'text', label: 'filter_config.products.search.postal_distinction', key: 'dispatchCode'},
            {type: 'text', label: 'filter_config.products.search.bar_code', key: 'barcode'},
            {type: 'text', label: 'filter_config.products.search.act_code', key: 'actCode'},
            {type: 'text', label: 'filter_config.products.search.recipient_name', key: 'recipientName'},
            {type: 'ng-select', label: 'filter_config.products.search.address', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term), items: sp.filters_data.recipient},
            {type: 'date', label: 'filter_config.products.search.address', key: 'date'},
            {type: 'text', label: 'filter_config.products.search.article_law_name', key: 'articleLawName'},
            {type: 'date', label: 'filter_config.products.search.article_law_date', key: 'articleLawDate'},
            {type: 'date', label: 'filter_config.products.search.acceptance_date', key: 'acceptanceDate'},
            {type: 'number', label: 'filter_config.products.search.attempts', key: 'attempt'},
            {type: 'text', label: 'filter_config.products.search.sender_name', key: 'senderName'},
            {type: 'ng-select', label: 'filter_config.products.search.sender',
             key: 'senderId', items: sp.filters_data.senders, labelVal: 'name'},
            {type: 'ng-select', label: 'filter_config.products.search.category',
             key: 'categoryId', items: sp.filters_data.categories, labelVal: 'name'},
            {type: 'ng-select', label: 'filter_config.products.search.agency',
             key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'ng-select', label: 'filter_config.products.search.product_type',
             key: 'typeId', items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'text', label: 'filter_config.products.search.note', key: 'note'}
        ],
        filters: (container, sp) => [
            {type: 'simpleText', label: 'filter_config.products.filter.Customer_name', key: 'customerName', value: ''},
            {type: 'auto-complete', label: 'filter_config.products.filter.client', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'filter_config.products.filter.agency',
             getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.products.filter.postal_distinction', key: 'dispatchCode', value: ''},
            {type: 'tag', label: 'filter_config.products.filter.bar_code', key: 'barcode', value: '', _class: 'tags-select'},
            {type: 'simpleText', label: 'filter_config.products.filter.act_code', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'filter_config.products.filter.product_name', key: 'productTypeName', value: ''},
            {type: 'ng-select', label: 'filter_config.products.filter.product', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'filter_config.products.filter.category', key: 'categoryId', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.products.filter.recipient_name', key: 'recipientName', value: ''},
            {type: 'auto-complete', label: 'filter_config.products.filter.address', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term),
                items: sp.filters_data.recipient, _class: 'auto-complete'},
            {type: 'auto-complete', label: 'filter_config.products.filter.recipient_postal_code',
             key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.products.filter.destination', key: 'destination'},
            {type: 'ng-select', label: 'filter_config.products.filter.grouping.value', labelVal: 'name', key: 'grouping',
                items: [{name: 'filter_config.products.filter.grouping.value', id: 'by_cap'},
                 {name: 'filter_config.products.filter.grouping.quant_per_client', id: 'by_client'}], unclearbale: true,
                selectedAttribute: {name: 'filter_config.products.filter.grouping.quant_per_cap', id: 'by_cap'}},
            {type: 'ng-select', label: 'filter_config.products.filter.street_location.value', labelVal: 'name', key: 'fixed',
                items: [{name: 'filter_config.products.filter.street_location.value', id: 'null'},
                 {name: 'filter_config.products.filter.street_location.localize', id: '1'},
                  {name: 'filter_config.products.filter.street_location.all', id: '0'}], unclearbale: true,
                selectedAttribute: {name: 'filter_config.products.filter.street_location.localize', id: 'null'}},
            // {type: 'ng-select', key: '__quantity_', label: 'Quantita per CAP:', items : [
            //         {name: 'Tutto', id: 'all'}, {name: 'Con Filtri Applicati', id: 'filters'} ], labelVal: 'name',
            //     selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'},
            //     change: (val) => {sp.grouping.filters = val.id ; }, unclearbale: true
            // },
            {type: ['date', 'date'], label: 'filter_config.products.filter.date_time', group: true, key: ['fromDate', 'toDate']},
            {type: 'simpleText', label: 'filter_config.products.filter.article_law', key: 'articleLawName'},
            {type: ['date', 'date'], label: 'filter_config.products.filter.article_law_date',
            group: true, key: ['fromArticleLawDate', 'toArticleLawDate']},
            {type: ['date', 'date'], label: 'filter_config.products.filter.acceptance_date',
             group: true, key: ['fromAcceptanceDate', 'toAcceptanceDate']},
             {type: 'simpleText', label: 'filter_config.products.filter.activity', key: '', value: ''},

        ],
        grouping: false,
        default_filters: {'grouping': 'by_cap', 'fixed': 'null'}
    },
    pre_dispatch: {
        search: (container, sp) => [
            {type: 'ng-select', label: 'filter_config.pre_dispatch.search.state.value', key: 'status', items:  [
                    {name: 'filter_config.pre_dispatch.search.state.in_Palnning', id: 'inPlanning'},
                    {name: 'filter_config.pre_dispatch.search.state.not_planned', id: 'notPlanned'},
                    {name: 'filter_config.pre_dispatch.search.state.planning', id: 'planned'},
                    {name: 'filter_config.pre_dispatch.search.state.paused', id: 'paused'}
                ], labelVal: 'name'},
            {type: 'text', label: 'filter_config.pre_dispatch.search.name', key: 'name'},
            {type: 'text', label: 'filter_config.pre_dispatch.search.postal_distinction', key: 'code'},
            {type: 'number', label: 'filter_config.pre_dispatch.search.quantity', key: 'quantity'},

        ],
        filters: (container, sp) => [
            {type: 'ng-select', label: 'filter_config.pre_dispatch.filter.state.value', key: 'status', items:  [
                    {name: 'filter_config.pre_dispatch.filter.state.in_Palnning', id: 'inPlanning'},
                    {name: 'filter_config.pre_dispatch.filter.state.not_planned', id: 'notPlanned'},
                    {name: 'filter_config.pre_dispatch.filter.state.planning', id: 'planned'},
                    {name: 'filter_config.pre_dispatch.filter.state.paused', id: 'paused'}
                ], labelVal: 'name'},
            {type: 'simpleText', label: 'filter_config.pre_dispatch.filter.name', key: 'name' , value: ''},
            {type: 'simpleText', label: 'filter_config.pre_dispatch.filter.postal_distinction', key: 'code'},
            {type: 'number', label: 'filter_config.pre_dispatch.filter.quantity', key: 'quantity'},
            {type: ['date', 'date'], label: 'filter_config.pre_dispatch.filter.date', group: true, key: ['formDate', 'toDate']},
        ],
        grouping: false,
    },
    dispatch: {
        search: (container, sp) => [
            {type: 'text', label: 'filter_config.dispatch.search.distinguished_name', key: 'setName'},
            {type: 'ng-select', label: 'filter_config.dispatch.search.agency',
            key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'text', label: 'filter_config.dispatch.search.product_name', key: 'productTypeName', value: ''},
            {type: 'text', label: 'filter_config.dispatch.search.recipient_name', key: 'recipientName'},

        ],
        filters: (container, sp) => [
            {type: 'auto-complete', label: 'filter_config.dispatch.filter.client', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'filter_config.dispatch.filter.agency',
             getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.distinguished_name', key: 'setName'},

            {type: 'simpleText', label: 'filter_config.dispatch.filter.note_day', key: 'dayNote'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.internal_notes_for_operators', key: 'setNote'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.postman_note', key: 'postmanNote'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.note_different', key: 'postmanDayNote'},

            {type: 'simpleText', label: 'filter_config.dispatch.filter.name_attachment', key: 'docName'},
            {type: 'ng-select', label: 'filter_config.dispatch.filter.status_distinguished.value', key: 'states', items:  [
                    {name: 'filter_config.dispatch.filter.status_distinguished.not_assigned', id: 'not_assigned'},
                    {name: 'filter_config.dispatch.filter.status_distinguished.bag_not_prepared', id: 'not_prepare'},
                ], labelVal: 'name'},
            {type: ['date', 'date'], label: 'filter_config.dispatch.filter.str_bill_date', group: true, key: ['startedFrom', 'startedTo']},
            {type: ['date', 'date'], label: 'filter_config.dispatch.filter.bill_date', group: true, key: ['createFrom', 'createTo']},
            {type: 'tag', label: 'filter_config.dispatch.filter.bar_code', key: 'barcode'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.act_code', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.set_code', key: 'setCode', value: ''},
            {type: 'ng-select', label: 'filter_config.dispatch.filter.product', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'filter_config.dispatch.filter.category',
             key: 'category', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.recipient_name', key: 'recipientName'},
            {type: 'auto-complete', label: 'filter_config.dispatch.filter.recipient_postal_code',
             key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.dispatch.filter.recipient_address', key: 'recipientAddress'},
        ],
        grouping: false,
        changeViewButton: {icon: '/assets/images/calendar.png', route: ['/dispatch/calender']}
    },
    delivering: {
        search: (container, sp) => [
            {type: 'text', label: 'filter_config.delivering.search.distinguished_name', key: 'name'},
            {type: 'ng-select', label: 'filter_config.delivering.search.agency',
             key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'text', label: 'filter_config.delivering.search.product_name', key: 'productTypeName', value: ''},
            {type: 'text', label: 'filter_config.delivering.search.recipient_name', key: 'recipientName'},

        ],
        filters: (container, sp) => [
            {type: 'auto-complete', label: 'filter_config.delivering.filter.client', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'filter_config.delivering.filter.agency',
             getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.distinguished_name', key: 'name'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.note_day', key: 'dayNote'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.internal_notes_for_operators', key: 'setNote'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.postman_notifications', key: 'postmanNote'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.note_different', key: 'postmanDayNote'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.name_attachment', key: 'docName'},
            {type: 'ng-select', label: 'filter_config.delivering.filter.status_distinguished', key: 'states', items:  [
                    {name: 'filter_config.delivering.filter.bag_prepared', id: 'prepared'},
                ], labelVal: 'name'},
            {type: ['date', 'date'], label: 'filter_config.delivering.filter.str_bill_date',
             group: true, key: ['startedFrom', 'startedTo']},
            {type: ['date', 'date'], label: 'filter_config.delivering.filter.bill_date', group: true, key: ['createFrom', 'createTo']},
            {type: 'tag', label: 'filter_config.delivering.filter.bar_code', key: 'barcode'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.act_code', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'filter_config.delivering.filter.set_code', key: 'setCode', value: ''},
            {type: 'ng-select', label: 'filter_config.delivering.filter.product', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'filter_config.delivering.filter.category', key: 'category', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.recipient_name', key: 'recipientName'},
            {type: 'auto-complete', label: 'filter_config.delivering.filter.recipient_postal_code',
            key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.delivering.filter.recipient_address', key: 'recipientAddress'},
        ],
        grouping: false,
        changeViewButton: {icon: '/assets/images/calendar.png', route: ['/delivering/calender']}
    },
    notdelivered: {
        search: (container, sp) => [
        {type: 'ng-select', label: 'filter_config.notdelivered.search.client', key: 'customerId',
         items:  sp.filters_data.customers, labelVal: 'name'},
            {type: 'text', label: 'filter_config.notdelivered.search.client_name', key: 'customerName'},
            {type: 'text', label: 'filter_config.notdelivered.search.postal_distinction', key: 'dispatchCode'},
            {type: 'text', label: 'filter_config.notdelivered.search.bar_code', key: 'barcode'},
            {type: 'text', label: 'filter_config.notdelivered.search.act_code', key: 'actCode'},
            {type: 'text', label: 'filter_config.notdelivered.search.recipient_name', key: 'recipientName'},
            {type: 'ng-select', label: 'filter_config.notdelivered.search.address', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term), items: sp.filters_data.recipient},
            {type: 'date', label: 'filter_config.notdelivered.search.address', key: 'date'},
            {type: 'text', label: 'filter_config.notdelivered.search.article_law_name', key: 'articleLawName'},
            {type: 'date', label: 'filter_config.notdelivered.search.article_law_date', key: 'articleLawDate'},
            {type: 'date', label: 'filter_config.notdelivered.search.acceptance_date', key: 'acceptanceDate'},
            {type: 'number', label: 'filter_config.notdelivered.search.attempts', key: 'attempt'},
            {type: 'text', label: 'filter_config.notdelivered.search.sender_name', key: 'senderName'},
            {type: 'ng-select', label: 'filter_config.notdelivered.search.sender',
             key: 'senderId', items: sp.filters_data.senders, labelVal: 'name'},
            {type: 'ng-select', label: 'filter_config.notdelivered.search.category',
             key: 'categoryId', items: sp.filters_data.categories, labelVal: 'name'},
            {type: 'ng-select', label: 'filter_config.notdelivered.search.agency',
             key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'ng-select', label: 'filter_config.notdelivered.search.product_type',
             key: 'typeId', items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'text', label: 'filter_config.notdelivered.search.note', key: 'note'}
        ],
        filters: (container, sp) => [
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.Customer_name', key: 'customerName', value: ''},
            {type: 'auto-complete', label: 'filter_config.notdelivered.filter.client', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'filter_config.notdelivered.filter.agency',
             getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.postal_distinction', key: 'dispatchCode', value: ''},
            {type: 'tag', label: 'filter_config.notdelivered.filter.bar_code', key: 'barcode', value: '', _class: 'tags-select'},
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.act_code', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.product_name', key: 'productTypeName', value: ''},
            {type: 'ng-select', label: 'filter_config.notdelivered.filter.product', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'filter_config.notdelivered.filter.category', 
            key: 'categoryId', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.recipient_name', key: 'recipientName', value: ''},
            {type: 'auto-complete', label: 'filter_config.notdelivered.filter.address', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term),
                items: sp.filters_data.recipient, _class: 'auto-complete'},
            {type: 'auto-complete', label: 'filter_config.notdelivered.filter.recipient_postal_code',
             key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.destination', key: 'destination'},
            {type: 'ng-select', label: 'filter_config.notdelivered.filter.grouping.value', labelVal: 'name', key: 'grouping',
                items: [{name: 'filter_config.notdelivered.filter.grouping.value', id: 'by_cap'},
                 {name: 'filter_config.notdelivered.filter.grouping.quant_per_client', id: 'by_client'}], unclearbale: true,
                selectedAttribute: {name: 'filter_config.notdelivered.filter.grouping.quant_per_cap', id: 'by_cap'}},
            {type: 'ng-select', label: 'filter_config.notdelivered.filter.street_location.value', labelVal: 'name', key: 'fixed',
                items: [{name: 'filter_config.notdelivered.filter.street_location.value', id: 'null'},
                 {name: 'filter_config.notdelivered.filter.street_location.localize', id: '1'},
                  {name: 'filter_config.notdelivered.filter.street_location.all', id: '0'}], unclearbale: true,
                selectedAttribute: {name: 'filter_config.notdelivered.filter.street_location.localize', id: 'null'}},
            // {type: 'ng-select', key: '__quantity_', label: 'Quantita per CAP:', items : [
            //         {name: 'Tutto', id: 'all'}, {name: 'Con Filtri Applicati', id: 'filters'} ], labelVal: 'name',
            //     selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'},
            //     change: (val) => {sp.grouping.filters = val.id ; }, unclearbale: true
            // },
            {type: ['date', 'date'], label: 'filter_config.notdelivered.filter.date_time', group: true, key: ['fromDate', 'toDate']},
            {type: 'simpleText', label: 'filter_config.notdelivered.filter.article_law', key: 'articleLawName'},
            {type: ['date', 'date'], label: 'filter_config.notdelivered.filter.article_law_date',
            group: true, key: ['fromArticleLawDate', 'toArticleLawDate']},
            {type: ['date', 'date'], label: 'filter_config.notdelivered.filter.acceptance_date',
             group: true, key: ['fromAcceptanceDate', 'toAcceptanceDate']},
             {type: 'simpleText', label: 'filter_config.notdelivered.filter.activity', key: '', value: ''},

        ],
        grouping: false,
        default_filters: {'grouping': 'by_cap', 'fixed': 'null'}
    },

};
