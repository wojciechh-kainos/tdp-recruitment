define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personRow", function () {

        
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person-row.html',
            scope: {
                person: '=',
                slotTimes: '=',
                days: '='
            },
            link: function (scope, element, attributes) {
                
                scope.getSlot = function (slotNumber, day) {
                    return scope.person.slotsList.find(function (slot) {
                        return (slotNumber === slot.number) && (new Date(slot.day).getDay() === day.getDay());
                    });
                }
            }
        }
        
    });
});
