define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/directives/tdprAvailabilityDirective'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope) {

        // TODO: To be filled by service
        $scope.staticData = {
          "slots_times": {},
          "persons": {}
        };

        $scope.startDateWeek = new Date("2016-08-01");
    })
});
