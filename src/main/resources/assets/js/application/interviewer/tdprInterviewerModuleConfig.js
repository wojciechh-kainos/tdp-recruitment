define(['angular'
, 'application/interviewer/tdprInterviewerModule'
, 'application/interviewer/controllers/tdprInterviewerHomeController'
, 'application/interviewer/controllers/tdprInterviewerDetailsController'
, 'application/interviewer/services/tdprSlotsService'
, 'application/interviewer/services/tdprPersonService'
, 'application/common/directives/tdprJobProfileCheckboxDirective'
, 'application/common/directives/tdprNewPasswordDirective'],
 function (angular, tdprInterviewerModule) {
   tdprInterviewerModule.config(function ($stateProvider) {
          $stateProvider
            .state("tdpr.interviewer", {
                url: "/interviewer",
                abstract: true,
                params : {
                    isRecruiter : false,
                    personName : '',
                    relativeDayNumber: 0
                },
                resolve: {
                    isUserAuthenticated: function(tdprAuthService, Notification, $state) {
                        if (!tdprAuthService.isUserLoggedIn()) {
                            Notification.error('You need to sign in to view this page.');
                            $state.go('tdpr.login');
                        }
                    }
                }
            }).state("tdpr.interviewer.home", {
                url: "/{id}/home",
                views: {
                    "@": {
                        templateUrl: "/html/partials/interviewer/tdp-interviewer-home.html",
                        controller: "tdprInterviewerHomeController"
                    }
                },
                resolve: {
                    person: getPersonDetails,
                    isUserAuthorized: isUserAuthorized
                }

            }).state("tdpr.interviewer.details", {
              url: "/{id}/details",
              views: {
                  "@": {
                      templateUrl: "/html/partials/interviewer/tdpr-interviewer-details.html",
                      controller: "tdprInterviewerDetailsController"
                  }
              },
              resolve:{
                  person: getPersonDetails,
                  isUserAuthorized: isUserAuthorized
              }
          });
        });

     function isUserAuthorized(tdprAuthService, Notification, $stateParams) {
        if (tdprAuthService.isUserAuthorized("interviewer") && tdprAuthService.getCurrentUser().id != $stateParams.id) {
            Notification.error('You dont have permissions to view this page.');
            $state.go('tdpr.interviewer.home', {id: tdprAuthService.getCurrentUser().id});
        }
     }

     function getPersonDetails(tdprPersonService, $stateParams, $state, $q){
         return tdprPersonService.getPersonDetails($stateParams.id).then( function (response) {
             return response;
         }, function (response) {
            if(response.status !== 401) {
                $state.go('tdpr.404');
            } else {
                $q.reject();
            }
         });
     }

    return tdprInterviewerModule;
});
