define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprCandidatesService', function ($http, $q) {

        this.fetchCandidates = function(){
            return $http.get('api/candidate/all').then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    return error;
                }
            )
        };

        this.createCandidate = function (candidate) {
            console.log(candidate);
            return $http.put("/api/candidate/create/", candidate).then(function (response) {
                return response;
            }, function (error) {
                error.message = "Candidate adding failed.";
                return $q.reject(error.message);
            });
        };

        this.updateCandidate = function (candidate) {
            return $http.put("/api/candidate/update/", candidate).then(function (response) {
                return response;
            }, function (error) {
                error.message = "Candidate updating failed.";
                return $q.reject(error.message);
            });
        };


        this.deleteCandidate = function(candidate){
            return $http.put('/api/candidate/' + candidate.id + '/deactivate').then(function(response){
                return response;
            }, function(error) {
                error.message = "Candidate deleting failed.";
                return $q.reject(error.message);
            })
        };

        this.fetchRecruiters = function(){
            return $http.get('api/person/all/recruiter').then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    return error;
                }
            )
        };

        this.fetchNotes = function(limit) {
            return $http.get('/api/candidate/getNote/' + limit).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    error.message = "Fetching notes failed.";
                    return $q.reject(error.message);
                }
            )
        }

    })
});
