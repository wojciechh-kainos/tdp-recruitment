define(['angular'
, 'application/interviewer/tdprInterviewerModule'
, 'application/interviewer/controllers/tdprInterviewerHomeController'
, 'application/interviewer/controllers/tdprInterviewerDetailsController'
, 'application/interviewer/services/tdprSlotsService'
, 'application/interviewer/services/tdprPersonService'
, 'application/common/directives/tdprJobProfileCheckboxDirective'],
 function (angular, tdprInterviewerModule) {
   tdprInterviewerModule.config(function ($stateProvider, $urlRouterProvider) {
          $stateProvider
            .state("tdpr.interviewer", {
                url: "/interviewer",
                abstract: true,
                params : {
                    isRecruiter : false,
                    personName : ''
                },
                resolve: {
                    isAuthenticated: function(tdprAuthService) {
                        return tdprAuthService.isAuthenticated("interviewer");
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
                  person: getPersonDetails
              }
          });
        });


     function getPersonDetails(tdprPersonService, $stateParams, $state){
         return tdprPersonService.getPersonDetails($stateParams.id).then( function (response) {
             return response;
         }, function () {
             $state.go('tdpr.404');
         });
     }

    return tdprInterviewerModule;
});
