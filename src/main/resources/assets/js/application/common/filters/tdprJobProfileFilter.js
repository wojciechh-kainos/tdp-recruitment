define(['application/common/tdprCommonModule'], function (tdprCommonModule) {
    tdprCommonModule.filter('jobProfileFilter', function () {
        return function (toFilter, jobProfile) {
            if (jobProfile === null || jobProfile === undefined) {
                return toFilter;
            }

            if (typeof jobProfile === 'string' || jobProfile instanceof String) {
                if (jobProfile === "") {
                    return toFilter;
                }

                return _.filter(toFilter,
                    function (report) {
                        if (report.person === null || report.person === undefined) {
                            return report[jobProfile];
                        } else {
                            return report.person[jobProfile];
                        }
                    });
            }

            return _.filter(toFilter,
                function (report) {
                    return _.find(jobProfile, function (value, key) {
                        if (report.person === null || report.person === undefined) {
                            return value === true && report[key] === value;
                        } else {
                            return value === true && report.person[key] === value;
                        }
                    });
                }
            );
        }
    });
});
