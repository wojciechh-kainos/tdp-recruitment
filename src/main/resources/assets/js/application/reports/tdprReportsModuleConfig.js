define(['angular'
    , 'application/reports/tdprReportsModule'
    , 'application/reports/controllers/tdprReportsController'
], function (angular, tdprReportsModule) {

    tdprReportsModule.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tdpr.reports", {
                url: '/reports',
                abstract: true
            })
            .state("tdpr.reports.home", {
                url: '/home',
                views: {
                    "@": {
                        templateUrl: '/js/application/reports/views/tdpr-reports-home.html',
                        controller: 'tdprReportsController'
                    }
                }
            });
        $urlRouterProvider.otherwise("/recruiter");
    });
    return tdprReportsModule;
});
