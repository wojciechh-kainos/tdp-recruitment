define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprAddInterviewerController", function ($scope, tdprPersonsService) {
        
        
        $scope.create = function(person){
            tdprPersonsService.createPerson(person);
            console.log(person)
        }
        

    })
});
