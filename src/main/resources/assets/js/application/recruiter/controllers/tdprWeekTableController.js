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
        $scope.days = [getDayOfTheWeek(new Date(), 0),2,3,4,5];
        $scope.monday = {};

        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff+i)); //i = 0 - monday
        }
    var i = 0;
        personsData.then(function () {
            $scope.persons = tdprPersonsService.getPersons();
        });

        slotsData.then(function () {
            $scope.timeData = tdprRecruiterGetSlotsTimesService.getSlots();
            $scope.timeData = $scope.timeData.slice(0,2);
        });

        $scope.startDateWeek = tdprPersonsService.getCurrentWeek();
        
    })
});
