define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
  tdprInterviewerModule.controller("tdprInterviewerHomeController", function($scope, tdprSlotsService, $filter, $stateParams,$timeout) {
    $scope.slotTimes = [];
        tdprSlotsService.getSlotsTimes().then(function(response) {
            for(var i = 0; i < response.data.length; i++) {
                var startTime = response.data[i].startTime.slice(0,5);
                var endTime = response.data[i].endTime.slice(0,5);
                $scope.slotTimes.push(startTime + "-" + endTime);
            }
    });

        $scope.startDate;
        $scope.endDate;


        var id = $stateParams.id;

        var relativeDayNumber = 0;
        $scope.slotsForWeek = new Array(18);

        var clearTable = function() {
            for(var i=0; i<$scope.slotsForWeek.length; i++){
                $scope.slotsForWeek[i]=new Array(5);
                for(var j=0; j<$scope.slotsForWeek[i].length; j++){
                    $scope.slotsForWeek[i][j] = {available: false};
                }
            };
        }

        clearTable();


        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff+i)); //i = 0 - monday
        }

        var getSlots = function(personId, relDayNumber) {
            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relDayNumber), "dd-MM-yyyy");
            var endDate = $filter('date')(getDayOfTheWeek(new Date(), relDayNumber + 4), "dd-MM-yyyy");

            $scope.startDate = startDate;
            $scope.endDate = endDate;
            tdprSlotsService.getSlots(startDate, endDate, personId).then(function(response){

                for(var slot in response.data){
                    $scope.slotsForWeek[response.data[slot].slot.id-1][new Date(response.data[slot].slotsDate).getDay() - 1].available = true;
                }
            });
        };

        $scope.updateSlots = function () {
            var slots = [];
            for (var i = 0; i < $scope.slotsForWeek.length; i++) {
                for (var j = 0; j < $scope.slotsForWeek[i].length; j++) {
                    if ($scope.slotsForWeek[i][j].available) {
                        var slot = {
                            slotsDate: getDayOfTheWeek(new Date(), j),
                            person: {id: id},
                            slot: {id: i + 1},
                            type: {id: 1}
                        };
                        slots.push(slot);
                    }
                }
            }
            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
            var endDate = $filter('date')(getDayOfTheWeek(new Date(), 4 + relativeDayNumber), "dd-MM-yyyy");
            tdprSlotsService.updateSlots(slots, id, startDate, endDate).then(function(){
                            $scope.showSubmitSuccess = true;
                            $timeout(function(){$scope.showSubmitSuccess=false;}, 2000);
                        });
        };

        $scope.showPreviousWeek = function() {
            relativeDayNumber = relativeDayNumber - 7;
            clearTable();
            getSlots(id, relativeDayNumber);
        }

        $scope.showNextWeek = function() {
            relativeDayNumber = relativeDayNumber + 7;
            clearTable();
            getSlots(id, relativeDayNumber);
        }

        getSlots(id, relativeDayNumber);

    });
});