define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/filters/tdprRecruiterJobProfileFilter'
    , 'application/recruiter/directives/tdprJobProfilesDirecrive'
    , 'application/recruiter/directives/tdprAvailabilityDirective'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'
    , 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'
    , 'application/recruiter/services/personsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprRecruiterGetSlotsTimesService, personsService) {
        var slotsData = tdprRecruiterGetSlotsTimesService.getSlotsTimes();
        var personsData = personsService.fetchPersons();

        $scope.staticData = [];
        $scope.timeData = {};
        $scope.jobProfiles = ["web", "dev", "test"];
        $scope.jobProfile = "";

        $scope.changeJobProfile = function(index) {
               $scope.jobProfile = $scope.jobProfiles[index];
        };

        personsData.then(function () {
            $scope.staticData = personsService.getPersons();
        });

        slotsData.then(function () {
            $scope.timeData = tdprRecruiterGetSlotsTimesService.getSlots();
        });

        $scope.startDateWeek = personsService.getCurrentWeek();
    })
});
