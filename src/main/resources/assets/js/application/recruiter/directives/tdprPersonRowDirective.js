define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personRow", function () {

        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person-row.html',
            replace: true,
            scope: {
                slotTimes: '=',
                slotsList: '='
            },
            link: function (scope, element, attributes) {
                scope.days = [1,2,3,4,5];
            }
        }
        
    });
});
