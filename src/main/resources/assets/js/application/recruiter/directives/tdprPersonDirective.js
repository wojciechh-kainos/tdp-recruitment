define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprScheduleService', 'notification'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("person", function (tdprScheduleService, Notification) {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            scope: {
                personData: '=',
                slotsTimes: '=',
                days: '='
            },
            link: function (scope, element, attributes) {
                scope.getSlot = function (slotNumber, day) {
                    return scope.personData.slotsList.find(function (slot) {
                        return (slotNumber === slot.number) && (new Date(slot.day).getDay() === day.getDay());
                    });
                };
                scope.getClass = function () {
                    return scope.slotsTimes.length < 10  ? 'cell-size-' + scope.slotsTimes.length : '';
                };

                scope.changeSlotType = function (slotNumber, day) {
                    var compareDate = new Date();

                    if (compareDate.getTime() < day.getTime()) {
                        tdprScheduleService.changeSlotTypeCycleThrough(scope.getSlot(slotNumber, day), slotNumber, day, scope.personData);
                    } else {
                        Notification.error({message: 'Cannot change past days!', delay: 2500});
                    }
                };
            }
        }
    });
});
