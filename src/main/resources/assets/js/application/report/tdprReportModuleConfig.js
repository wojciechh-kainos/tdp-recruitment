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
                     isUserAuthenticated: function(tdprAuthService, Notification, $q, $location) {
                         var deferred = $q.defer();

                         if (tdprAuthService.isUserLoggedIn()) {
                             deferred.resolve();
                         } else {
                             $location.path('/login');
                             Notification.error('You need to sign in to view this page.');
                             deferred.reject();
                         }
                         return deferred.promise;
                     },
                     isUserAuthorized: function(tdprAuthService, Notification, $q, $state, $location) {
                         var deferred = $q.defer();

                         if(tdprAuthService.isUserAuthorized("recruiter")) {
                             deferred.resolve();
                         } else {
                             Notification.error('You do not have permissions to view this page.');
                             deferred.reject();
                         }

                         return deferred.promise;
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
