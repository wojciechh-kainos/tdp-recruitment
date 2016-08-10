define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/filters/tdprRecruiterJobProfileFilter'
    , 'application/recruiter/directives/tdprJobProfilesDirecrive'
    , 'application/recruiter/directives/tdprAvailabilityDirective'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'
    , 'application/recruiter/directives/tdprFilterDirective'
    , 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprRecruiterGetSlotsTimesService, tdprPersonsService, JobProfileEnum) {
        var slotsData = tdprRecruiterGetSlotsTimesService.getSlotsTimes();
        var personsData = tdprPersonsService.fetchPersons();

        $scope.staticData = [];
        $scope.timeData = {};
        $scope.jobProfile = JobProfileEnum.dev;

        personsData.then(function () {
            $scope.staticData = tdprPersonsService.getPersons();
        });

        slotsData.then(function () {
            $scope.timeData = tdprRecruiterGetSlotsTimesService.getSlots();
        });

        $scope.startDateWeek = tdprPersonsService.getCurrentWeek();

    })
});
