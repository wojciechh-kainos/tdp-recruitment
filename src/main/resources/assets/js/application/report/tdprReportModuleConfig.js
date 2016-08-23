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
                        templateUrl: "/html/partials/report/tdpr-report-index.html"
                    }
                },
                 resolve: {
                   isUserAuthenticated: function(tdprAuthService) {
                       return tdprAuthService.isUserAuthenticated();
                   },
                   isUserAuthorized: function(tdprAuthService) {
                       return tdprAuthService.isUserAuthorized("recruiter");
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

    });
    return tdprReportModule;
});
