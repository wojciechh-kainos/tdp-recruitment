define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.filter('jobReportProfileFilter', function () {
        return function (reports, jobProfile) {
            if (jobProfile === undefined) {
                return reports;
            }

            if (typeof jobProfile === 'string' || jobProfile instanceof String) {
                return _.filter(reports,
                    function (report) {
                        return report.person[jobProfile]
                    }
                );
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
