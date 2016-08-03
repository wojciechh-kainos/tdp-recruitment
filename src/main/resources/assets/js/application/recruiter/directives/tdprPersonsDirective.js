define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personsDirective", function () {
        return {
            restrict: 'A',
            templateUrl: 'html/partials/tdpr-directive-persons.html',
            scope: {
                selectedPersonTable: '=',
                timeElements: '=',
                startWeekDay: '='
            },
            link: function (scope, element, attributes) {
                var peopleList = [];

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
                        var childrenCount = checkArray[i].children.length;

                        if (childrenCount > 0) {
                            for (var j = 0; j < childrenCount; j++) {

                                if (checkArray[i].children[j].length > 0) {
                                    //array.push(_returnTableRows(checkArray[i].children[j]));
                                    array[checkArray[i].children[j].id] = _returnTableRows(checkArray[i].children[j]);
                                } else {
                                    //array.push(checkArray[i].children[j]);
                                    array[checkArray[i].children[j].id] = checkArray[i].children[j];
                                }
                            }
                        } else {
                            // if( checkArray[i].delete ){
                            //     checkArray[i].delete('isExpanded');
                            //     checkArray[i].delete('isActive');
                            //     checkArray[i].delete('selected');
                            // }

                            //array.push(checkArray[i]);
                            array[checkArray[i].id] = checkArray[i];
                        }
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
