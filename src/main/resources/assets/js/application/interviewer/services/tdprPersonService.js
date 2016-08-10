define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdprInterviewerModule.service("tdprPersonService", function($http) {

        var person;

        this.getPersonDetails = function(id) {
            return $http.get("/api/person/" + id).then(function(response){
                person = response.data;
                return response;
            });
        };

        this.updatePersonDetails = function(person){
            return $http.put("/api/person/create", person);
        };

        this.getPerson = function(){
            return person;
        };
    })
});
