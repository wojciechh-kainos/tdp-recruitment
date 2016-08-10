define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personsDirective", function (JobProfileEnum) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-persons.html',
            scope: {
                persons: '=',
                timeElements: '=',
                weekDay: '='
            },
            link: function (scope, element, attributes) {
                scope.jobProfile = "";

                /* Returns sorted rows for table */
                function _returnTableRows(checkArray) {
                    // Possibly add here check for job profile
                    var type = JobProfileEnum[scope.jobProfile];

                    return _.filter(checkArray, function (value) {
                        return value.person[type] === true;
                    });
                }

                function _refreshList(table) {
                    scope.peopleList = _returnTableRows(table);
                }

                function refresh() {
                    _refreshList(scope.persons);
                }

                function _changeJobProfile(newValue) {
                    scope.jobProfile = newValue;
                }

                scope.$watch('persons', function (newValue) {
                    _refreshList(newValue);
                });

                scope.$parent.$watch('weekDay', function () {
                    refresh();
                });

                scope.$parent.$parent.$watch('jobProfile', function (newValue) {
                    _changeJobProfile(newValue);
                    refresh();
                });
            }
        };
    });
});
