define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/common/services/tdprUsefulFunctionsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.filter('filterByRecruiter', function(tdprUsefulFunctions) {
        return function(toFilter, recruiter) {
            if (tdprUsefulFunctions.isUndefinedOrNull(recruiter)) {
                return toFilter;
            }

            if (recruiter.id === 0) {
                return toFilter;
            }

            return _.filter(toFilter, function (value) {
                return value.recruiter.id === recruiter.id;
            });
        };
    });
});
