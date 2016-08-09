define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personRow", function () {

        
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person-row.html',
            replace: true,
            scope: {
                person: '=',
                slotTimes: '=',
                slotsList: '='
            },
            link: function (scope, element, attributes) {
                scope.days = [1,2,3,4,5];
                
                scope.getSlot = function (slotId, day) {
                    return scope.slotsList.find(function (slot) {
                        return (slotId === slot.slot) && (new Date(slot.day).getDay() === day);
                    });
                }
            }
        }
        
    });
});
