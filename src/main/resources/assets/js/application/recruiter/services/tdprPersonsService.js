define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPersonsService', function ($http, dateFilter, $q) {
        var persons;
        
        this.fetchPersonsWithSlotsForDates = function(start, end){
            var format = 'yyyy-MM-dd';

            return $http.get('api/person/all?startDate=' + dateFilter(start, format) + '&endDate=' + dateFilter(end, format)).then(
                function (response) {
                    persons = response.data;
                    return response;
                },
                function (error) {
                    return error;
                }
            )
        };
        
        this.getPersons = function () {
            return persons;
        };

        this.createPerson = function (person) {
            return $http.put("/api/person/create/", person).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Interviewer adding failed.";
                return $q.reject(err);
            });
        };

    })
});
