define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("person", function () {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            scope: {
                personData: '=',
                slotsTimes: '=',
                days: '=',
                changeSlotType: '&',
                submitSlotChanges: '&'
            },
            link: function (scope, element, attributes) {

                scope.note = scope.personData.noteList ? '"' + scope.personData.noteList[0].description + '"': 'none';

                scope.getSlot = function (slotNumber, day) {
                    return scope.personData.slotList.find(function (slot) {
                        return (slotNumber === slot.number) && (new Date(slot.day).getDay() === day.getDay());
                    });
                };
                scope.getClass = function () {
                    return scope.slotsTimes.length < 10  ? 'cell-size-' + scope.slotsTimes.length : '';
                };
            }
        }

    });
});
