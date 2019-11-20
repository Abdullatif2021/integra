const api_url = 'https://apiplannerintegraa.storexweb.com'
// const api_url = ''
export const AppConfig = {
    api_url: api_url,
    endpoints: {
        getCities: `${api_url}/api/getCities`, // get cities list
        getStreet: `${api_url}/api/getStreet`, // get streets list
        getProducts: `${api_url}/api/getProducts`, // get to deliver products list
        getFiltersData: `${api_url}/api/initFilterData`,
        getRecipients: `${api_url}/api/recipient`,
        getPreDispatched: `${api_url}/api/preDispatch`,
        createPreDispatched: `${api_url}/api/preDispatch`,
        preDispatchAddProducts: `${api_url}/api/preDispatch/addProducts`,
        mergePreDispatches: `${api_url}/api/preDispatch/merge`,
        exportPreDispatches: `${api_url}/api/preDispatch/export`,
        getPreDispatchProducts: `${api_url}/api/preDispatch/getProducts`,
        preDispatchEdit: `${api_url}/api/preDispatch`,
        getProvider: `${api_url}/api/provider`,
        getProviders: `${api_url}/api/providers`,
        createProviderKeys: `${api_url}/api/providerKey`,
        editProviderKeys: `${api_url}/api/providerKey`,
        deleteProviderKeys: `${api_url}/api/providerKey`,
        getProviderKeys: `${api_url}/api/providerKey`,
        getProductStatusType: `${api_url}/api/product/getProductStatusType`,
        updateProductStatusType: `${api_url}/api/product/productStatusType`,
        // getPreDispatchStreets: (id) => `${api_url}/api/preDispatch/${id}/streets`,
        getPaginationOptions: `${api_url}/api/config`,
        updatePaginationOptions: `${api_url}/api/config/update`,
        updateStreetsData: `${api_url}/api/street/update`,
        getTreeNode: (id) => `${api_url}/api/preDispatch/${id}/tree`,
        createTree: `${api_url}/api/preDispatch/tree/create`,
        moveStreet: `${api_url}/api/preDispatch/tree/moveStreet`,
        moveCap: `${api_url}/api/preDispatch/tree/moveCap`,
        getMoveToCity: (id) => `${api_url}/api/preDispatch/${id}/tree/moveCap/availableCities`,
        getMoveToCap: (id) => `${api_url}/api/preDispatch/${id}/tree/moveStreet/availableCaps`,
        getPreDispatchToLocateProducts: (id) => `${api_url}/api/preDispatch/${id}/products`,
        updateCityName: `${api_url}/api/preDispatch/tree/updateCityName`,
        updateStreetName: `${api_url}/api/preDispatch/tree/updateStreetName`,
        getAllStartPoints: `${api_url}/api/startPoint`,
        getAllEndPoints: `${api_url}/api/endPoint`,
        updatePreDispatchStartPoint: `${api_url}/api/preDispatch/startPoint/update`,
        updatePreDispatchEndPoint: `${api_url}/api/preDispatch/endPoint/update`,
        searchTree: (id) => `${api_url}/api/preDispatch/${id}/search`,
        getPreDispatchData: (id) => `${api_url}/api/preDispatch/${id}`,
        createStartPoint: `${api_url}/api/startPoint/create`,
        createEndPoint: `${api_url}/api/endPoint/create`,
        editStartPoint: `${api_url}/api/startPoint/update`,
        editEndPoint: `${api_url}/api/endPoint/update`,
        editBuildingAddress: `${api_url}/api/preDispatch/product/updateLocation`
    },

};