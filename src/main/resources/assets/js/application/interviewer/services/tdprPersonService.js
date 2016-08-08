define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdprInterviewerModule.service("tdprPersonService", function($http) {

        this.getPersonById = function(id) {
            return $http.get("/api/person/" + id);
        };
    })
});