define(['application/recruiter/tdprRecruiterModule', 'application/constants/tdprConstantsModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPersonsService', function ($http, dateFilter, $q, HttpStatusCodes) {

        this.fetchPersonsWithSlotsForDates = function(start, end) {
            var format = 'yyyy-MM-dd';

            return $http.get('api/person/all?startDate=' + dateFilter(start, format) + '&endDate=' + dateFilter(end, format)).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    return error;
                }
            )
        };

        this.fetchPersons = function() {
            return $http.get("/api/person/all/withoutSlots").then(function (response) {
                return response;
            }, function (error) {
                return $q.reject(error);
            });
        };

        this.createPerson = function (person) {
            return $http.put("/api/person/create/", person).then(function (response) {
                return response;
            }, function (err) {

                if (err.status == HttpStatusCodes.conflict) {
                    err.message = "Email address already in use.";
                } else {
                    err.message = "Interviewer adding failed.";
                }
                return $q.reject(err);
            });
        };

        this.managePerson = function (person) {
            return $http.put("/api/person/" + person.id + "/switchAccountStatus");
        };

        this.resendActivationLink = function (person) {
            return $http.put("/api/person/" + person.id + "/resendActivationLink");
        };

    })
});
