define(['angular'
    , 'application/report/tdprReportModule'
    , 'application/report/controllers/tdprReportDetailsController'
    , 'application/common/filters/tdprJobProfileFilter'
    , 'application/common/directives/tdprJobProfileDirective'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
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
                        templateUrl: "/js/application/report/views/tdpr-report-index.html"
                    }
                }
            })
            .state("tdpr.report.home", {
                url: '/report',
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
