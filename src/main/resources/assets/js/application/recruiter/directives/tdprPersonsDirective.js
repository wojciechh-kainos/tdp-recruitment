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
                scope.jobProfile = "";

                /* Returns sorted rows for table */
                function _returnTableRows(checkArray) {
                    var array = {};

                    // Possibly add here check for job profile

                    for (var i = 0; i < checkArray.length; i++) {
                    var type;
                    if(scope.jobProfile == "dev"){
                        type = "isDev";
                    }
                    if(scope.jobProfile == "web"){
                        type = "isWeb";
                    }
                    if(scope.jobProfile == "test"){
                        type = "isTest";
                    }
                        if(checkArray[i].person[type] == true)
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

                function _changeJobProfile(newValue){
                    scope.jobProfile = newValue;
                }

                scope.$watch('selectedPersonTable', function (newValue, oldValue) {
                    _refreshList(newValue);
                });

                scope.$parent.$watch('startWeekDay', function (newValue, oldValue) {
                    _init();
                });

                scope.$parent.$parent.$watch('jobProfile', function (newValue, oldValue) {
                    _changeJobProfile(newValue);
                });
            }
        };
    });
});
