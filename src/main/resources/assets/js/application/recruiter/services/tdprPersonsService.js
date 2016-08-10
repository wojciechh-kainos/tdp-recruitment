define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPersonsService', function ($http, dateFilter) {
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
        }
    })
});
