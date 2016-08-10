define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPersonsService', function ($http, dateFilter, $q, tdprDateService) {
        var persons;
        var weekStart;
        var weekEnd;
        var currentDay = new Date();

        var setStartEndWeek = function () {
            var now = currentDay;

            weekStart = new Date();
            weekEnd = new Date();

            weekStart.setDate(now.getDate() - now.getDay() + 1);
            weekEnd.setDate(now.getDate() + (7 - now.getDay()));

            weekStart = tdprDateService.resetDate(weekStart);
            weekEnd = tdprDateService.resetDate(weekEnd);
        };

        this.fetchPersons = function () {
            var format = 'yyyy-MM-dd';

            setStartEndWeek();

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

        this.changeCurrentWeek = function(newDate) {
            currentDay = tdprDateService.resetDate(newDate);
            setStartEndWeek(newDate);
            return weekStart;
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
