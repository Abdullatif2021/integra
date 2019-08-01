const api_url = 'https://apiplannerintegraa.storexweb.com'
// const api_url = ''
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
        getPreDispatchProducts: api_url + '/api/preDispatch/getProducts',
        preDispatchedit: api_url + '/api/preDispatch',
        getProvider: api_url + '/api/provider',
        createProviderKeys: api_url + '/api/providerKey',
        editProviderKeys: api_url + '/api/providerKey',
        deleteProviderKeys: api_url + '/api/providerKey',
        getProviderKeys: api_url + '/api/providerKey',
        getProductStatusType: api_url + '/api/product/getProductStatusType',
        updateProductStatusType: api_url + '/api/product/productStatusType',

    },

};