const api_url = 'http://apiplannerintegraa.storexweb.com'
export const AppConfig = {
    api_url: api_url,
    endpoints: {
        getCities: api_url + '/api/getCities', // get cities list
        getStreet: api_url + '/api/getStreet', // get streets list
        getProducts: api_url + '/api/getProducts', // get to deliver products list
        getFiltersData: api_url + '/api/initFilterData',
        getRecipients: api_url + '/api/recipient',
        getPreDispatched: api_url + '/api/preDispatch',
        createPreDispatched: api_url + '/api/preDispatch',
        preDispatchAddProducts: api_url + '/api/preDispatch/addProducts',
        mergePreDispatches: api_url + '/api/preDispatch/merge',
        exportPreDispatches: api_url + '/api/preDispatch/export',
        getPreDispatchProducts: api_url + '/api/preDispatch/getProducts'
    },

};