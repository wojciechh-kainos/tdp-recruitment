define(['angular', 'application/recruiter/tdprRecruiterModule' 
    , 'application/recruiter/directives/tdprAvailabilityDirective'  //directives deps should be moved to moduleConfig
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'
    , 'application/recruiter/directives/tdprFilterDirective'
    , 'application/recruiter/directives/tdprPersonRowDirective'
    , 'application/recruiter/directives/tdprSlotDirective'
    , 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprRecruiterGetSlotsTimesService, tdprPersonsService) {
        var slotsData = tdprRecruiterGetSlotsTimesService.getSlotsTimes();
        var personsData = tdprPersonsService.fetchPersons();

        $scope.staticData = [];
        $scope.timeData = {};
    var i = 0;
        personsData.then(function () {
            $scope.persons = tdprPersonsService.getPersons();
        });

        slotsData.then(function () {
            $scope.timeData = tdprRecruiterGetSlotsTimesService.getSlots();
        });

        $scope.startDateWeek = tdprPersonsService.getCurrentWeek();
        
    })
});
