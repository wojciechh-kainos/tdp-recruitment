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
    })
});