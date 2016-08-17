define(['angular'
    , 'application/report/tdprReportModule'
    , 'application/report/controllers/tdprReportController'
    , 'application/report/controllers/tdprReportDetailsController'
], function (angular, tdprReportModule) {

    tdprReportModule.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tdpr.report", {
                url: '/report',
                abstract: true,
                params: {
                    dateStart: '08-08-2016',
                    dateEnd: '25-08-2016',
                    personId: false
                },
                views: {
                    "@": {
                        templateUrl: "/js/application/report/views/tdpr-report-index.html"
                    }
                }
            })
            .state("tdpr.report.home", {
                url: '/details',
                views: {
                    "main@report": {
                        templateUrl: '/js/application/report/views/tdpr-report-details.html',
                        controller: 'tdprReportDetailsController'
                    }
                }
            });
        $urlRouterProvider.otherwise("/recruiter");
    });
    return tdprReportModule;
});
