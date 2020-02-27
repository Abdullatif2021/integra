
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
            {type: 'ng-select', label: 'Cliente', key: 'customerId', items:  sp.filters_data.customers, labelVal: 'name', value: ''},
            {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: sp.filters_data.agencies, labelVal: 'name', value: ''},
            {type: 'simpleText', label: 'Distinita Postale', key: 'dispatchCode', value: ''},
            {type: 'tag', label: 'Codice Barre', key: 'barcode', value: '', _class: 'tags-select'},
            {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
            {type: 'simpleText', label: 'Nome Prodotto:', key: 'productTypeName', value: ''},
            {type: 'ng-select', label: 'Prodotto', key: 'productTypeNameId',
                items: sp.filters_data.products_type, labelVal: 'type'},
            {type: 'ng-select', label: 'Categoria', key: 'categoryId', items: sp.filters_data.categories,
                labelVal: 'name', value: ''},
            {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName', value: ''},
            {type: 'ng-select', label: 'Destinatario', key: 'recipientId', labelVal: 'name',
                getMethod: (term) => container.recipientsService.getRecipientsByName(term),
                items: sp.filters_data.recipient},
            {type: 'ng-select', label: 'CAP Destinatario:', key: 'recipientCap', items: sp.filters_data.caps_group,
                labelVal: 'name'},
            {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'destination'},
            {type: 'ng-select', label: 'Raggruppamento quantita:', labelVal: 'name',
                items: [{name: 'Quantità per CAP', id: 'cap'}, {name: 'Quantità per Cliente', id: 'client'}],
                change: (val) => {sp.groupByChanged(val) ; }, unclearbale: true,
                selectedAttribute: {name: 'Quantità per CAP', id: 'cap'}},
            {type: 'ng-select', key: '__quantity_', label: 'Quantita per CAP:', items : [
                    {name: 'Tutto', id: 'all'}, {name: 'Con Filtri Applicati', id: 'filters'} ], labelVal: 'name',
                selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'},
                change: (val) => {sp.grouping.filters = val.id ; }, unclearbale: true
            },
            {type: ['date', 'date'], label: 'Data/Ora:', group: true, key: ['fromDate', 'toDate']},
            {type: 'simpleText', label: 'Articolo Legge', key: 'articleLawName'},
            {type: ['date', 'date'], label: 'Data Articolo Legge:', group: true, key: ['fromArticleLawDate', 'toArticleLawDate']},
            {type: ['date', 'date'], label: 'Data Accettazione:', group: true, key: ['fromAcceptanceDate', 'toAcceptanceDate']},
        ],
        grouping: false,
    },
    pre_dispatch: {
        search: (container, sp) => [
            {type: 'ng-select', label: 'Status', key: 'status', items:  [
                    {name: 'In Planning', id: 'inPlanning'},
                    {name: 'Not Planning', id: 'notPlanned'},
                    {name: 'Planned', id: 'planned'},
                    {name: 'Paused', id: 'paused'}
                ], labelVal: 'name'},
            {type: 'text    ', label: 'Nominativo', key: 'name'},
            {type: 'text', label: 'Distinita Postale', key: 'code'},
            {type: 'number', label: 'Quantity', key: 'quantity'},

        ],
        filters: (container, sp) => [
            {type: 'ng-select', label: 'Status', key: 'status', items:  [
                    {name: 'In Planning', id: 'inPlanning'},
                    {name: 'Not Planning', id: 'notPlanned'},
                    {name: 'Planned', id: 'planned'},
                    {name: 'Paused', id: 'paused'}
                ], labelVal: 'name'},
            {type: 'simpleText', label: 'Nominativo', key: 'name'},
            {type: 'simpleText', label: 'Distinita Postale', key: 'code'},
            {type: 'number', label: 'Quantity', key: 'quantity'},
            {type: ['date', 'date'], label: 'Data :', group: true, key: ['formDate', 'toDate']},
        ],
        grouping: false
    },
    dispatch: {
        search: (container, sp) => [],
        filters: (container, sp) => [],
        grouping: false
    }


};