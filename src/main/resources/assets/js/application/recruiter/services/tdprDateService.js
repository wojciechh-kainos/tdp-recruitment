define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprDateService', function () {
        this.resetDate = function (dateToReset) {
            var date = new Date(dateToReset);

            date.setHours(2);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date;
        };

        this.setHourMin = function (dateToSet, hour, min) {
            var date = new Date(dateToSet);

            date.setHours(hour);
            date.setMinutes(min);

            return date;
        }
    });
});
