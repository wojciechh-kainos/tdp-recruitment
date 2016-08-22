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
                    function (filtering) {
                        if (filtering.person === null || filtering.person === undefined) {
                            return report[jobProfile];
                        } else {
                            return filtering.person[jobProfile];
                        }
                    });
            }

            return _.filter(toFilter,
                function (filtering) {
                    return _.find(jobProfile, function (value, key) {
                        if (filtering.person === null || filtering.person === undefined) {
                            return value === true && filtering[key] === value;
                        } else {
                            return value === true && filtering.person[key] === value;
                        }
                    });
                }
            );
        }
    });
});
