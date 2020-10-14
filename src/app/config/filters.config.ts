
export const FilterConfig = {
    products: {
        search: (container, sp) => [
            {type: 'ng-select', label: 'Cliente', key: 'customerId', items:  sp.filters_data.customers, labelVal: 'name'},
            {type: 'text', label: 'Nominativo Cliente', key: 'customerName'},
            {type: 'text', label: 'Distinita Postale', key: 'dispatchCode'},
            {type: 'text', label: 'Codice Barre', key: 'barcode'},
            {type: 'text', label: 'Codice Atto', key: 'actCode'},
            {type: 'text', label: 'Nominativo Destinatario', key: 'recipientName'},
            {type: 'ng-select', label: 'Destinatario', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term), items: sp.filters_data.recipient},
            {type: 'date', label: 'Data/Ora', key: 'date'},
            {type: 'text', label: 'Articolo Legge', key: 'articleLawName'},
            {type: 'date', label: 'Data Articolo Legge', key: 'articleLawDate'},
            {type: 'date', label: 'Data Accettazione', key: 'acceptanceDate'},
            {type: 'number', label: 'TENTATIVI', key: 'attempt'},
            {type: 'text', label: 'Nominativo MITTENTE', key: 'senderName'},
            {type: 'ng-select', label: 'MITTENTE', key: 'senderId', items: sp.filters_data.senders, labelVal: 'name'},
            {type: 'ng-select', label: 'Categoria', key: 'categoryId', items: sp.filters_data.categories, labelVal: 'name'},
            {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'ng-select', label: 'Product Type', key: 'typeId', items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'text', label: 'Note', key: 'note'}
        ],
        filters: (container, sp) => [
            {type: 'simpleText', label: 'Nominativo Cliente', key: 'customerName', value: ''},
            {type: 'auto-complete', label: 'Cliente', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'Agenzia', getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'Distinita Postale', key: 'dispatchCode', value: ''},
            {type: 'tag', label: 'Codice Barre', key: 'barcode', value: '', _class: 'tags-select'},
            {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'Nome Prodotto:', key: 'productTypeName', value: ''},
            {type: 'ng-select', label: 'Prodotto', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'Categoria', key: 'categoryId', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName', value: ''},
            {type: 'auto-complete', label: 'Destinatario', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term),
                items: sp.filters_data.recipient, _class: 'auto-complete'},
            {type: 'auto-complete', label: 'CAP Destinatario:', key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'destination'},
            {type: 'ng-select', label: 'Raggruppamento quantita:', labelVal: 'name', key: 'grouping',
                items: [{name: 'Quantità per CAP', id: 'by_cap'}, {name: 'Quantità per Cliente', id: 'by_client'}], unclearbale: true,
                selectedAttribute: {name: 'Quantità per CAP', id: 'by_cap'}},
            {type: 'ng-select', label: 'Localizzazione strada:', labelVal: 'name', key: 'fixed',
                items: [{name: 'Tutti', id: 'null'}, {name: 'Localizzato', id: '1'}, {name: 'Non localizzato', id: '0'}], unclearbale: true,
                selectedAttribute: {name: 'Tutti', id: 'null'}},
            // {type: 'ng-select', key: '__quantity_', label: 'Quantita per CAP:', items : [
            //         {name: 'Tutto', id: 'all'}, {name: 'Con Filtri Applicati', id: 'filters'} ], labelVal: 'name',
            //     selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'},
            //     change: (val) => {sp.grouping.filters = val.id ; }, unclearbale: true
            // },
            {type: ['date', 'date'], label: 'Data/Ora:', group: true, key: ['fromDate', 'toDate']},
            {type: 'simpleText', label: 'Articolo Legge', key: 'articleLawName'},
            {type: ['date', 'date'], label: 'Data Articolo Legge:', group: true, key: ['fromArticleLawDate', 'toArticleLawDate']},
            {type: ['date', 'date'], label: 'Data Accettazione:', group: true, key: ['fromAcceptanceDate', 'toAcceptanceDate']},
        ],
        grouping: false,
        default_filters: {'grouping': 'by_cap', 'fixed': 'null'}
    },
    pre_dispatch: {
        search: (container, sp) => [
            {type: 'ng-select', label: 'Stato', key: 'status', items:  [
                    {name: 'In Planning', id: 'inPlanning'},
                    {name: 'Not Planning', id: 'notPlanned'},
                    {name: 'Planned', id: 'planned'},
                    {name: 'Paused', id: 'paused'}
                ], labelVal: 'name'},
            {type: 'text    ', label: 'Nominativo', key: 'name'},
            {type: 'text', label: 'Distinita Postale', key: 'code'},
            {type: 'number', label: 'Q.tà', key: 'quantity'},

        ],
        filters: (container, sp) => [
            {type: 'ng-select', label: 'Stato', key: 'status', items:  [
                    {name: 'In Planning', id: 'inPlanning'},
                    {name: 'Not Planning', id: 'notPlanned'},
                    {name: 'Planned', id: 'planned'},
                    {name: 'Paused', id: 'paused'}
                ], labelVal: 'name'},
            {type: 'simpleText', label: 'Nominativo', key: 'name'},
            {type: 'simpleText', label: 'Distinita Postale', key: 'code'},
            {type: 'number', label: 'Q.tà', key: 'quantity'},
            {type: ['date', 'date'], label: 'Data :', group: true, key: ['formDate', 'toDate']},
        ],
        grouping: false,
    },
    dispatch: {
        search: (container, sp) => [
            {type: 'text', label: 'Nominativo Distinta', key: 'setName'},
            {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'text', label: 'Nome Prodotto:', key: 'productTypeName', value: ''},
            {type: 'text', label: 'Nominativo Destinatario', key: 'recipientName'},

        ],
        filters: (container, sp) => [
            {type: 'auto-complete', label: 'Cliente', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'Agenzia', getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Distinta', key: 'setName'},

            {type: 'simpleText', label: 'Nota giorno', key: 'dayNote'},
            {type: 'simpleText', label: 'Note interne per operatori', key: 'setNote'},
            {type: 'simpleText', label: 'Notifiche postino', key: 'postmanNote'},
            {type: 'simpleText', label: 'Note distinta', key: 'postmanDayNote'},

            {type: 'simpleText', label: 'Nome allegato', key: 'docName'},
            {type: 'ng-select', label: 'Stato Distinta ', key: 'states', items:  [
                    {name: 'Non assegnato', id: 'not_assigned'},
                    {name: 'Borsa non preparata', id: 'not_prepare'},
                ], labelVal: 'name'},
            {type: ['date', 'date'], label: 'Start Data Distinta:', group: true, key: ['startedFrom', 'startedTo']},
            {type: ['date', 'date'], label: 'Data Distinta:', group: true, key: ['createFrom', 'createTo']},
            {type: 'tag', label: 'Codice Barre', key: 'barcode'},
            {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'Set Code', key: 'setCode', value: ''},
            {type: 'ng-select', label: 'Prodotto', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'Categoria', key: 'category', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName'},
            {type: 'auto-complete', label: 'CAP Destinatario:', key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'recipientAddress'},
        ],
        grouping: false,
        changeViewButton: {icon: '/assets/images/calendar.png', route: ['/dispatch/calender']}
    },
    delivering: {
        search: (container, sp) => [
            {type: 'text    ', label: 'Nominativo Distinta', key: 'name'},
            {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name'},
            {type: 'text', label: 'Nome Prodotto', key: 'productTypeName', value: ''},
            {type: 'text', label: 'Nominativo Destinatario', key: 'recipientName'},

        ],
        filters: (container, sp) => [
            {type: 'auto-complete', label: 'Cliente', key: 'customerId',
                getMethod: (term) => container.customersService.getCustomersByName(term),
                items:  sp.filters_data.customers, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'auto-complete', label: 'Agenzia', getMethod: (term) => container.agenciesService.getAgenciesByName(term),
                key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: '', _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Distinta', key: 'name'},
            {type: 'simpleText', label: 'Nota giorno', key: 'dayNote'},
            {type: 'simpleText', label: 'Note interne per operatori', key: 'setNote'},
            {type: 'simpleText', label: 'Notifiche postino', key: 'postmanNote'},
            {type: 'simpleText', label: 'Note distinta', key: 'postmanDayNote'},
            {type: 'simpleText', label: 'Nome allegato', key: 'docName'},
            {type: 'ng-select', label: 'Stato Distinta ', key: 'states', items:  [
                    {name: 'Borsa preparata', id: 'prepared'},
                ], labelVal: 'name'},
            {type: ['date', 'date'], label: 'Start Data Distinta:', group: true, key: ['startedFrom', 'startedTo']},
            {type: ['date', 'date'], label: 'Data Distinta:', group: true, key: ['createFrom', 'createTo']},
            {type: 'tag', label: 'Codice Barre', key: 'barcode'},
            {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'Set Code', key: 'setCode', value: ''},
            {type: 'ng-select', label: 'Prodotto', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'auto-complete', label: 'Categoria', key: 'category', items: sp.filters_data.categories,
                labelVal: 'name', value: '', getMethod: (term) => container.getCategoriesByName(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName'},
            {type: 'auto-complete', label: 'CAP Destinatario:', key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name', getMethod: (term) => container.recipientsService.getCapCity(term), _class: 'auto-complete'},
            {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'recipientAddress'},
        ],
        grouping: false,
        changeViewButton: {icon: '/assets/images/calendar.png', route: ['/delivering/calender']}
    },

};