define(['angular' 
, 'application/interviewer/tdprInterviewerModule' 
, 'application/interviewer/controllers/tdprInterviewerHomeController' 
, 'application/interviewer/services/tdprSlotsService'
 , 'application/interviewer/services/tdprPersonService' ],
 function (angular, tdprInterviewerModule) { 
   tdprInterviewerModule.config(function ($stateProvider, $urlRouterProvider) { 
          $stateProvider 
            .state("tdpr.interviewer", { 
                abstract: true ,
                url: "/interviewer"
            }).state("tdpr.interviewer.home", { 
                url: "/{id}/home", 
                views: { 
                    "@": { 
                        templateUrl: "/html/partials/interviewer/tdp-interviewer-home.html", 
                        controller: "tdprInterviewerHomeController" 
                    } 
                }
            }); 

          $urlRouterProvider.otherwise("/interviewer/1/home");
        }); 

    return tdprInterviewerModule; 
});
