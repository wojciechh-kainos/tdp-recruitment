define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprDateService', function (dateFilter) {
        this.resetDate = function (dateToReset) {
            var date = new Date(dateToReset);

            // Compensate for timezone differences
            date.setHours(date.getTimezoneOffset() / (-60.0));
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
        };

        this.formatDate = function (dateToFormat) {
            return dateFilter(dateToFormat, "yyyy-MM-dd");
        };

        this.compareTime = function (compare, compareTo) {
            if (compare === undefined || compareTo === undefined) return false;
            return compare.getTime() === compareTo.getTime();
        };
    });
});
