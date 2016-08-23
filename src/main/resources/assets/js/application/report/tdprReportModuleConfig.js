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
                        templateUrl: "/js/application/report/views/tdpr-report-index.html"
                    }
                },
                resolve: {
                     isAuthenticated: function(tdprAuthService) {
                         return tdprAuthService.isAuthenticated("recruiter");
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
