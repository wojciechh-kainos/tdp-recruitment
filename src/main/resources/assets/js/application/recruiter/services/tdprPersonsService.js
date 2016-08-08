define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPersonsService', function ($http, dateFilter, tdprDateService) {
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
            return tdprDateService.resetDate(weekStart);
        };

        this.getPersons = function () {
            return persons;
        }
    })
});
