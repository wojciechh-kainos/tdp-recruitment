define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.service('tdprReportDateService', ['moment', function (moment) {

        this.getLastWeekStartDate = function () {
            return moment().subtract(1, 'week').isoWeekday('Monday').toDate();
        };

        this.getLastWeekEndDate = function () {
            return moment(this.getLastWeekStartDate()).isoWeekday('Sunday').toDate();
        };

        this.getLastMonthStartDate = function () {
            return moment().subtract(1, 'month').startOf('month').toDate();
        };

        this.getLastMonthEndDate = function () {
            return moment(this.getLastMonthStartDate()).endOf('month').toDate();
        };
    }]);
});
