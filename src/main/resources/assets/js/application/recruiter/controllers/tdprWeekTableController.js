define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/filters/tdprRecruiterJobProfileFilter'
    , 'application/recruiter/directives/tdprAvailabilityDirective'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'
    , 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprRecruiterGetSlotsTimesService, tdprPersonsService) {
        var slotsData = tdprRecruiterGetSlotsTimesService.getSlotsTimes();
        var personsData = tdprPersonsService.fetchPersons();

        $scope.staticData = [];
        $scope.timeData = {};
        $scope.jobProfiles = ["web", "dev", "test"];
        $scope.jobProfile = "";

        $scope.isDev = false;
        $scope.isOps = false;
        $scope.isTest = true;

        $scope.changeJobProfile = function(index) {
               $scope.jobProfile = $scope.jobProfiles[index];
        };

        personsData.then(function () {
            $scope.staticData = tdprPersonsService.getPersons();
        });

        slotsData.then(function () {
            $scope.timeData = tdprRecruiterGetSlotsTimesService.getSlots();
        });

        $scope.startDateWeek = tdprPersonsService.getCurrentWeek();
    })
});
