define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprCandidatesService', function ($http) {

        this.fetchCandidates = function(){
            return $http.get('api/candidate/all').then(
                function (response) {
                    console.log(response.data);
                    return response.data;
                },
                function (error) {
                    return error;
                }
            )
        };

        this.createCandidate = function (person) {
            return $http.put("/api/candidate/create/", person).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Interviewer adding failed.";
                return $q.reject(err);
            });
        };

    })
});
