define(['angular'
    , 'application/report/tdprReportModule'
    , 'application/report/controllers/tdprReportDetailsController'
    , 'application/common/filters/tdprJobProfileFilter'
    , 'application/common/directives/tdprJobProfileDirective'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
], function (angular, tdprReportModule) {

    tdprReportModule.config(function ($stateProvider) {
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
                     isUserAuthenticated: function(tdprAuthService, Notification, $state) {
                        if (!tdprAuthService.isUserLoggedIn()) {
                            Notification.error('You need to sign in to view this page.');
                            $state.go('tdpr.login');
                        }
                     },
                     isUserAuthorized: function(tdprAuthService, Notification, $state) {
                        if(!tdprAuthService.isUserAuthorized("recruiter")) {
                            Notification.error('You do not have permissions to view this page.');
                            $state.go('tdpr.login');
                        }
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
