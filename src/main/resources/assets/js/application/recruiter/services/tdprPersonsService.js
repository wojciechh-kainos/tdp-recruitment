define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPersonsService', function ($http, dateFilter) {
        var persons;
        var weekStart;
        var weekEnd;
        var currentDay = new Date();

        this.fetchPersons = function(){
            var format = 'yyyy-MM-dd';

            var now = currentDay;
            weekStart = new Date();
            weekEnd = new Date();

            weekStart.setDate(now.getDate() - now.getDay() + 1);
            weekEnd.setDate(now.getDate() + (7 - now.getDay()));
            return $http.get('api/person/all?startDate=' + dateFilter(weekStart, format) + '&endDate=' + dateFilter(weekEnd, format)).then(
                function (response) {
                    persons = response.data;
                    return response;
                },
                function (error) {
                    return error;
                }
            )
        };

        this.getCurrentWeek = function() {
            return new Date(new Date(new Date(weekStart.setHours(2)).setMinutes(0)).setSeconds(0));
        };

        this.getPersons = function () {
            return persons;
        }
    })
});
