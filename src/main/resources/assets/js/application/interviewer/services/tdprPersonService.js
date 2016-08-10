define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdprInterviewerModule.service("tdprPersonService", function($http) {

        this.getPersonDetails = function(id) {
            return $http.get("/api/person/" + id);
        };

        this.updatePersonDetails = function(person){
            return $http.put("/api/person/create", person);
        }
    })
});
