define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personsDirective", function (JobProfileEnum) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-persons.html',
            scope: {
                selectedPersonTable: '=',
                timeElements: '=',
                startWeekDay: '='
            },
            link: function (scope, element, attributes) {
                scope.jobProfile = "";

                /* Returns sorted rows for table */
                function _returnTableRows(checkArray) {
                    // Possibly add here check for job profile
                    var type = JobProfileEnum[scope.jobProfile];

                    return _.filter(checkArray, function (value, index) {
                        return value.person[type] === true;
                    });
                }

                function _refreshList(table) {
                    scope.peopleList = _returnTableRows(table);
                }

                function _init() {
                    _refreshList(scope.selectedPersonTable);
                }

                function _changeJobProfile(newValue) {
                    scope.jobProfile = newValue;
                }

                scope.$watch('selectedPersonTable', function (newValue, oldValue) {
                    _refreshList(newValue);
                });

                scope.$parent.$watch('startWeekDay', function () {
                    _init();
                });

                scope.$parent.$parent.$watch('jobProfile', function (newValue, oldValue) {
                    _changeJobProfile(newValue);
                    _init();
                });
            }
        };
    });
});
