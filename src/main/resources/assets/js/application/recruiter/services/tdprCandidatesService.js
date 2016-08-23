define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprCandidatesService', function ($http, $q) {

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

        this.createCandidate = function (candidate) {
            return $http.put("/api/candidate/create/", candidate).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Candidate adding failed.";
                return $q.reject(err);
            });
        };

        this.deleteCandidate = function(candidate){
            return $http.get('/api/candidate/' + candidate.id + '/deactivate').then(function(response){
                return response;
            }), function(error) {
                error.message = "Deleting failed.";
                return $q.reject(error);
            }
        }

    })
});
