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
                url: "/interviewer"
            }).state("tdpr.interviewer.home", { 
                url: "/home/{id}", 
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
                  service: "tdprPersonService",
                  promise: function(service, $stateParams){
                      return service.getPersonDetails($stateParams.id);
                  }
              }
          }); 

          $urlRouterProvider.otherwise("/interviewer/home/1");
        }); 

    return tdprInterviewerModule; 
});
