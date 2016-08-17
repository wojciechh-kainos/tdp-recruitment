define(['angular'
    , 'application/report/tdprReportModule'
    , 'application/report/controllers/tdprReportController'
], function (angular, tdprReportModule) {

    tdprReportModule.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tdpr.report", {
                url: '/report',
                abstract: true
            })
            .state("tdpr.report.home", {
                url: '/home',
                views: {
                    "@": {
                        templateUrl: '/js/application/report/views/tdpr-reports-home.html',
                        controller: 'tdprReportsController'
                    }
                }
            });
        $urlRouterProvider.otherwise("/recruiter");
    });
    return tdprReportModule;
});
