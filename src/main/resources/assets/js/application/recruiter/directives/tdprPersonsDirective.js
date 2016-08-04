define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personsDirective", function () {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-persons.html',
            scope: {
                selectedPersonTable: '=',
                timeElements: '=',
                startWeekDay: '='
            },
            link: function (scope, element, attributes) {
                scope.activePerson = null;
                scope.AvailabilityEnum = Object.freeze(
                    {
                        unavailable: {
                            priority: 1,
                            name: "unavailable",
                            className: "cell-avail-unavailable",
                            tooltipText: "unavailable "
                        },
                        available: {
                            priority: 2,
                            name: "available",
                            className: "cell-avail-available",
                            tooltipText: "available "
                        },
                        init: {priority: 3, name: "init", className: "cell-avail-init", tooltipText: "init call"},
                        full: {priority: 4, name: "full", className: "cell-avail-full", tooltipText: "full "}
                    });

                /* Returns sorted rows for table */
                function _returnTableRows(checkArray) {
                    var array = {};

                    if (scope.activePerson !== null) {

                    }

                    for (var i = 0; i < checkArray.length; i++) {
                        array[checkArray[i].person.id] = checkArray[i];
                    }

                    return array;
                }

                function _changeActive(person) {
                    if (scope.activePerson === null) {
                        scope.activePerson = person;
                        return;
                    }

                    if (scope.activePerson.id === person.id) {
                        scope.activePerson = null;
                    } else {
                        scope.activePerson = person;
                    }
                }

                function _getActivePerson() {
                    return scope.activePerson;
                }

                function _refreshList(table) {
                    scope.peopleList = _returnTableRows(table);
                }

                function _init() {
                    scope.getActivePerson = _getActivePerson;
                    scope.changeActive = _changeActive;
                }

                scope.$watch('selectedPersonTable', function (newValue, oldValue) {
                    _refreshList(newValue);
                });

                scope.$parent.$watch('startWeekDay', function (newValue, oldValue) {
                    _init();
                });
            }
        };
    });
});
