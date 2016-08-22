define(['angular', 'application/common/tdprCommonModule'], function (angular, tdprCommonModule) {
    tdprCommonModule.directive("jobProfile", function (JobProfileEnum) {
        return {
            restrict: 'AE',
            templateUrl: 'html/partials/common/tdpr-directive-job-profile.html',
            replace: false,
            scope: {
                selectedProfiles: '=',
                isRadio: '='
            },
            link: function (scope, element, attributes) {
                scope.JobProfiles = JobProfileEnum;

                var mapped = _.mapKeys(scope.JobProfiles, function (value) {
                    return value.column;
                });

                var changeSelections = function (initial, selected) {
                    return _.forEach(mapped, function (value, key) {
                        if (key !== "radio") {
                            if (initial === true) {
                                mapped[key] = true;
                            } else {
                                mapped[key] = key === selected;
                            }
                        }
                    });
                };

                scope.selectedProfiles = changeSelections(true);

                // Initial selected for radio
                scope.selectedProfiles.radio = scope.JobProfiles.isDev.column;
                scope.change = function (column) {
                    scope.selectedProfiles = changeSelections(false, column);
                };
            }
        }
    })
});
