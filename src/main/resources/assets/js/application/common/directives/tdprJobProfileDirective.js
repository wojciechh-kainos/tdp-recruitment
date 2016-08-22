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
                scope.JobProfileEnum = JobProfileEnum;

                var mapped = _.mapKeys(scope.JobProfileEnum, function (value) {
                    return value.column;
                });

                var changeSelections = function (initial, selected) {
                    return _.forEach(mapped, function (value, key) {
                        if (key !== "selected") {
                            if (initial === true) {
                                mapped[key] = true;
                            } else {
                                mapped[key] = key === selected;
                            }
                        }
                    });
                };

                if (scope.isRadio === true) {
                    scope.selectedProfiles = changeSelections(false, scope.JobProfileEnum.isDev.column);

                    // Initial selected for radio
                    scope.selectedProfiles.selected = scope.JobProfileEnum.isDev.column;
                } else {
                    scope.selectedProfiles = changeSelections(true);
                }

                scope.change = function (column) {
                    scope.selectedProfiles = changeSelections(false, column);
                };
            }
        }
    })
});
