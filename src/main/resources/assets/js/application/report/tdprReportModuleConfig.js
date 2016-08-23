define(['angular'
    , 'application/report/tdprReportModule'
    , 'application/report/controllers/tdprReportDetailsController'
], function (angular, tdprReportModule) {

    tdprReportModule.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tdpr.report", {
                abstract: true,
                params: {
                    dateStart: '',
                    dateEnd: '',
                    personId: false
                },
                views: {
                    "@": {
                        templateUrl: "/html/partials/report/tdpr-report-index.html"
                    }
                }
            })
            .state("tdpr.report.home", {
                url: '/report',
                views: {
                    "main@report": {
                        templateUrl: '/html/partials/report/tdpr-report-details.html',
                        controller: 'tdprReportDetailsController'
                    }
                }
            });
        $urlRouterProvider.otherwise("/recruiter");
    });
    return tdprReportModule;
});
