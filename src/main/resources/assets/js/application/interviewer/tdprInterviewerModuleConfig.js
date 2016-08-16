define(['angular' 
, 'application/interviewer/tdprInterviewerModule'
, 'application/interviewer/controllers/tdprInterviewerHomeController'
, 'application/interviewer/controllers/tdprInterviewerDetailsController'
, 'application/interviewer/services/tdprSlotsService'
, 'application/interviewer/services/tdprPersonService'],
 function (angular, tdprInterviewerModule) { 
   tdprInterviewerModule.config(function ($stateProvider, $urlRouterProvider) { 
          $stateProvider 
            .state("tdpr.interviewer", { 
                abstract: true ,
                params : {
                    isRecruiter : false,
                    personName : ''
                },
                url: "/interviewer"
            }).state("tdpr.interviewer.home", { 
                url: "/{id}/home", 
                views: { 
                    "@": { 
                        templateUrl: "/html/partials/interviewer/tdp-interviewer-home.html", 
                        controller: "tdprInterviewerHomeController" 
                    } 
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
                  person: function(tdprPersonService, $stateParams){
                      return tdprPersonService.getPersonDetails($stateParams.id);
                  }
              }
          }); 

          $urlRouterProvider.otherwise("/recruiter");
        }); 

    return tdprInterviewerModule; 
});
