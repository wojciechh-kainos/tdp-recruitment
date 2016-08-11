define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprDateService', function (dateFilter) {

        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff + i)); //i = 0 - monday
        }

        this.getCurrentWeek = function () {
            return this.getWeekWithOffset(0);
        };

        this.getWeekWithOffset = function (offset) {
            var today = new Date();
            var weekDays = [];
            for (var i = 0; i < 5; i++) {  //iterate from monday to friday
                weekDays.push(getDayOfTheWeek(today, i + offset * 7));
            }
            return weekDays;
        };

        this.resetDate = function (dateToReset) {
            var date = new Date(dateToReset);

            // Compensate for timezone differences
            date.setHours(date.getTimezoneOffset() / (-60.0));
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date;
        };

        this.formatDate = function (dateToFormat) {
            return dateFilter(dateToFormat, "yyyy-MM-dd");
        };

        this.compareTime = function (compare, compareTo) {
            if (compare === undefined || compareTo === undefined) return false;
            return compare.getTime() === compareTo.getTime();
        };
    })
});
