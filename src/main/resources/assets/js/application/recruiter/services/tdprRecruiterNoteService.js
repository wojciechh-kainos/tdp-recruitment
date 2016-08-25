define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterNoteService', function ($http, $q) {
        this.fetchRecruiterNotes = function(limit) {
            return $http.get('/api/recruiterNote/' + limit).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    error.message = "Fetching notes failed.";
                    return $q.reject(error.message);
                }
            )
        };

        this.createRecruiterNote = function (note) {
            return $http.put("/api/recruiterNote/", note).then(function (response) {
                return response;
            }, function (error) {
                error.message = "Candidate adding failed.";
                return $q.reject(error.message);
            });
        };

    });
});
