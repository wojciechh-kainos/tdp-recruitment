define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.filter('jobReportProfileFilter', function () {
        return function (reports, jobProfile) {
            if (jobProfile === undefined) {
                return reports;
            }

            return _.filter(reports,
                function (report) {
                    return _.find(jobProfile, function (value, key) {
                        return value === true && report.person[key] === value;
                    });
                }
            );
        }
    });
});
