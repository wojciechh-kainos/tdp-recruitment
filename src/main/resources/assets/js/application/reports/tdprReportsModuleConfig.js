define(['angular'
    , 'application/reports/tdprReportsModule'
    , 'application/reports/controllers/tdprReportsController'
], function (angular, tdprReportsModule) {

    tdprReportsModule.config(function ($stateProvider) {
        $stateProvider
            .state("reports", {
                url: '/reports',
                abstract: true,
                views: {
                    "@": {
                        templateUrl: '/js/application/reports/views/tdpr-reports-home.html',
                        controller: 'tdprReportsController'
                    }
                }
            });
    });
    return tdprReportsModule;
});
