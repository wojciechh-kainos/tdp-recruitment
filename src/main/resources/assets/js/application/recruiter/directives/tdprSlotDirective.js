define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("slot", function () {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-slot.html',
            replace: true,
            scope: {
                slotData: '='

            },
            link: function (scope, element, attributes) {
                scope.isAvailable = function () {
                  return !(typeof scope.slotData === 'undefined');
                };
                
                scope.getStyle = function () {
                    
                  return scope.slotData ? 'cell-avail-' + scope.slotData.type : '';
                };
                
                // scope.$watch('slotData', function (newVal, oldVal) {
                //     if (typeof newVal === 'undefined') {
                //         scope.type = 'unavailable'
                //
                //     } else {
                //         scope.type = newVal.type;
                //         element.addClass('cell-avail-available');
                //     }
                // });
            }
        }
    })
});