define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdprInterviewerModule.service("tdprPersonService", function($http) {

        var person;

        this.getPersonDetails = function (id) {
            return $http.get("/api/person/" + id).then(function (response) {
                person = response.data;
                return response;
            });
        };

        this.updatePersonDetails = function (person) {
            return $http.put("/api/person/" + person.id, person);
        };

        this.getPerson = function () {
            return person;
        };

        this.getNote = function (personId, date) {
            return $http.get("/api/person/" + personId + "/getNote?date=" + date);
        };

        this.updateNote = function (note) {
            return $http.put("/api/person/updateNote", note);
        };
    });
});