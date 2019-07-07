
export const AppConfig = {

    endpoints: {
        getCities: '/api/getCities', // get cities list
        getStreet: '/api/getStreet', // get streets list
        getProducts: '/api/getProducts', // get to deliver products list
        getFiltersData: '/api/initFilterData',
        getRecipients: '/api/recipient',
        getPreDispatched: '/api/preDispatch',
        createPreDispatched: '/api/preDispatch',
        preDispatchAddProducts: '/api/preDispatch/addProducts',
        mergePreDispatches: '/api/preDispatch/merge',
        exportPreDispatches: '/api/preDispatch/export',
        getPreDispatchProducts: '/api/preDispatch/getProducts'
    },

};