define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('personsService', function ($http, dateFilter) {
        var persons;
        
        this.fetchPersons = function(){
            var format = 'yyyy-MM-dd';

            var now = new Date();
            var weekStart = new Date();
            var weekEnd = new Date();

            weekStart.setDate(now.getDate() - now.getDay() + 1);
            weekEnd.setDate(now.getDate() + (7 - now.getDay()));
            return $http.get('api/person/all?startDate=' + dateFilter(weekStart, format) + '&endDate=' + dateFilter(weekEnd, format)).then(
                function (response) {
                    persons = response.data;
                    return response;
                },
                function (error) {
                    console.log(error);
                    return error;
                }
            )
        };

        this.getPersons = function () {
            return persons;
        }
    })
});