define(['application/common/tdprCommonModule', 'application/common/services/tdprUsefulFunctionsService'], function (tdprCommonModule) {
    tdprCommonModule.filter('jobProfileFilter', function (tdprUsefulFunctions) {
        return function (toFilter, jobProfile) {
            if (tdprUsefulFunctions.isUndefinedOrNull(jobProfile)) {
                return toFilter;
            }

            if (typeof jobProfile === 'string' || jobProfile instanceof String) {
                if (jobProfile === "") {
                    return toFilter;
                }

                return _.filter(toFilter,
                    function (filtering) {
                        if (tdprUsefulFunctions.isUndefinedOrNull(filtering.person)) {
                            return filtering[jobProfile];
                        } else {
                            return filtering.person[jobProfile];
                        }
                    });
            }

            return _.filter(toFilter,
                function (filtering) {
                    return _.find(jobProfile, function (value, key) {
                        if (tdprUsefulFunctions.isUndefinedOrNull(filtering.person)) {
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
