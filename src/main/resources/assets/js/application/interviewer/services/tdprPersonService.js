define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdprInterviewerModule.service("tdprPersonService", function($http) {

        this.getNote = function(personId, date) {
            return $http.get("/api/person/" + personId + "/getNote?date=" + date);
        };

        this.updateNote = function(note) {
            return $http.put("/api/person/updateNote", note);
        };
    })
});