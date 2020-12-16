const api_url = 'https://apiplannerintegraa.storexweb.com'
// const api_url = ''
export const AppConfig = {
    api_url: api_url,
    endpoints: {
        getCities: `${api_url}/api/getCities`, // get cities list
        getStreet: `${api_url}/api/getStreet`, // get streets list
        getProducts: `${api_url}/api/getProducts`, // get to deliver products list
        getFiltersData: `${api_url}/api/initFilterData`,
        getRecipients: `${api_url}/api/recipients`,
        getPreDispatched: `${api_url}/api/preDispatch`,
        createPreDispatched: `${api_url}/api/preDispatch`,
        preDispatchAddProducts: `${api_url}/api/preDispatch/addProducts`,
        mergePreDispatches: `${api_url}/api/preDispatch/merge`,
        exportPreDispatches: `${api_url}/api/preDispatch/export`,
        getPreDispatchProducts: `${api_url}/api/preDispatchProduct`,
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
        getNotMatchesTreeNode: (id) => `${api_url}/api/preDispatch/${id}/notMatchesTree`,
        createTree: `${api_url}/api/preDispatch/tree/create`,
        moveStreet: `${api_url}/api/preDispatch/tree/moveStreet`,
        moveCap: `${api_url}/api/preDispatch/tree/moveCap`,
        getMoveToCity: (id) => `${api_url}/api/preDispatch/${id}/tree/moveCap/availableCities`,
        getMoveToCap: (id) => `${api_url}/api/preDispatch/${id}/tree/moveStreet/availableCaps`,
        getPreDispatchToLocateProducts: (id) => `${api_url}/api/preDispatch/${id}/products`,
        getNotFoundProducts: (id) => `${api_url}/api/preDispatch/${id}/getNotFixedProducts`,
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
        editBuildingAddress: `${api_url}/api/preDispatch/product/updateLocation`,
        moveToInPlanning: `${api_url}/api/preDispatch/toPlanning`,
        changePreDispatchParameters: `${api_url}/api/preDispatch/update`,
        groupProducts: (id) => `${api_url}/api/preDispatch/${id}/grouping`,
        groupingProgress: (id) => `${api_url}/api/preDispatch/${id}/getGroupingPercent`,
        getStreetMergeAvailableStreets: (id) => `${api_url}/api/preDispatch/${id}/getAvailableStreets`,
        mergeTwoStreets: `${api_url}/api/preDispatch/mergerStreets`,
        updatePreDispatchRunningStatus: (id) => `${api_url}/api/preDispatch/${id}/changeLocalizeStatus`,
        divideToDistenta: (id) => `${api_url}/api/preDispatch/${id}/toSets`,
        getScheduleResults: (id) => `${api_url}/api/preDispatch/${id}/scheduleResults`,
        getSetByStatus: (id) => `${api_url}/api/preDispatch/${id}/getSetByStatus`,
        getSetTreeNode: (id) => `${api_url}/api/set/${id}/tree`,
        getPostmenByPreDispatch: (id) => `${api_url}/api/preDispatch/${id}/schedulePostmen`,
        updateSetPostman: (id) => `${api_url}/api/sets/${id}/updatePostman`,
        getAllSets: `${api_url}/api/sets/get`,
        getAssignedPostmen: `${api_url}/api/postmen/assigned/get`,
        getPlannedPreDispatches: `${api_url}/api/preDispatches/planned`,
        getMatchesRate: (id) => `${api_url}/api/preDispatch/${id}/getMatchRate`,
        confirmPlanning: (id) => `${api_url}/api/preDispatch/${id}/confirmPlanning`,
        makeDispatchesVisible: (id) => `${api_url}/api/preDispatch/${id}/makeSetsVisible`,
        publishPreDispatchSets: (id) => `${api_url}/api/preDispatch/${id}/publishSet`,
        assignToSet: (id) => `${api_url}/api/set/${id}/assignManual`,
        orderTreeNode: (id) => `${api_url}/api/preDispatch/${id}/shift`,
        getAddressesTreeMapMarkers: (id) => `${api_url}/api/preDispatch/${id}/markers`,
        getSetProductsCoordinates: (id) => `${api_url}/api/set/${id}/products/coordinate`,
        saveSetPath: (id) => `${api_url}/api/set/${id}/savePath`,
        getSetPath: (id) => `${api_url}/api/set/${id}/getPath`,
        getSetsWithoutPaths: (id) => `${api_url}/api/preDispatch/${id}/sets/withoutPaths`,
        getSetGroups: (id) => `${api_url}/api/set/${id}/groups`,
        setMapPriority: `${api_url}/api/sets/setMapPriority`,
        shiftGroupPriority: (id) => `${api_url}/api/group/${id}/shiftPriority`,
        getSetMarkers: (id) => `${api_url}/api/set/${id}/coordinate`,
        exportPreDispatchResults: (id) => `${api_url}/api/preDispatch/${id}/exportResults`,
        getPredispatchLog: (id) => `${api_url}/api/preDispatch/${id}/logs`,
        createNewGroup: (id) => `${api_url}/api/preDispatch/${id}/createNewGroup`,
        getCapCity: `${api_url}/api/recipientCap`,
        getAgencies: `${api_url}/api/agencies`,
        getCustomers: `${api_url}/api/customers`,
        deleteResults: (id) => `${api_url}/api/preDispatch/${id}/deleteResults`,
        getNotFixedItems: (id) => `${api_url}/api/preDispatch/${id}/getNotFixedProduct`,
        moveNotFixesGroupToSet: `${api_url}/api/group/moveToSet`,
        getCategories: `${api_url}/api/categories`,
        getProductByCategory: `${api_url}/api/getProductByCategory`,
        getStreetToLocalize: `${api_url}/api/getStreetToLocalize`,
        saveLocalizedStreets: `${api_url}/api/localizeStreets`,
        dispatchDelete: `${api_url}/api/set/deletePublished`,
        dispatchPrepare: `${api_url}/api/set/changeToPrepared`,
        getWeeklyCalender: `${api_url}/api/calender/weeklyCalender`,
        getCalenderWeeklySets: `${api_url}/api/calender/weeklySets`,
        getCalenderDailySets: `${api_url}/api/calender/dailySets`,
        getCalenderWeeklyPostmen: `${api_url}/api/calender/weeklyPostmen`,
        getCalenderDailyPostmen: `${api_url}/api/calender/dailyPostmen`,
        getSetDetails: (id) => `${api_url}/api/calender/set/${id}/get`,
        getAvailableUsers: `${api_url}/api/set/availableUser`,
        assignToUser: `${api_url}/api/set/assign`,
        saveNoteToDay: `${api_url}/api/calender/saveDayNote`,
        updatePostmanDayNote: `${api_url}/api/calender/savePostmanDayNote`,
        saveNoteToSet: (id) => `${api_url}/api/calender/set/${id}/saveNote`,
        getCalenderAvailablePostmen: `${api_url}/api/calender/getAvailablePostmen`,
        getDispatchLog: (id) => `${api_url}/api/set/${id}/logs`,
        getproductLog: (id) => `${api_url}/api/products/${id}/logs`,
        getSetProductsAndPath: (id) => `${api_url}/api/set/${id}/products`,
        getActivities: `${api_url}/api/activity/get`,
        getSubActivities: `${api_url}/api/activity/sub/get`,
        activityDelete: `${api_url}/api/activity/delete/sub`,
        getActivitiesPostmen: `${api_url}/api/activity/postmen/get`,
        getActivitiesOperators: `${api_url}/api/activity/operators/get`,
        getAvailableStatuses: `${api_url}/api/products/getAvailableStatus`,
        changeProductStatus: `${api_url}/api/products/changeStatus`,
        createNewActivity: `${api_url}/api/activity/create`,
        getActivityAvailableCaps: `${api_url}/api/activity/sub/getCaps`,
        getActivityAvailableProductCategories: `${api_url}/api/activity/sub/getCategories`,
        getActivityTotalProducts: `${api_url}/api/activity/sub/getTotalProducts`,
        getActivitySubActivityEndDate: `${api_url}/api/activity/sub/getEndDate`,
        getActivityOperators: `${api_url}/api/activity/operators/get`,
        getActivityPostmen: `${api_url}/api/activity/postmen/get`,
        createSubActivity: `${api_url}/api/activity/sub/create`,
        updateSubActivity: `${api_url}/api/activity/sub/update`,
        updateActivity: `${api_url}/api/activity/update`,
        getSummaryProductsByState: `${api_url}/api/products/getByState`
    },

};

