define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
  tdprInterviewerModule.controller("tdprInterviewerHomeController", function($scope, tdprSlotsService, $filter, $stateParams) {
    $scope.slotTimes = ["9.00-9.30", "9.30-10.00", "10.00-10.30", "10.30-11.00", "11.00-11.30", "11.30-12.00", "12.00-12.30",
     "12.30-13.00", "13.00-13.30", "13.30-14.00", "14.00-14.30", "14.30-15.00", "15.00-15.30", "15.30-16.00", "16.00-16.30","16.30-17.00", "17.00-17.30", "17.30-18.00"];

    var id = $stateParams.id;

    var slotsForWeek = new Array(18);
    for(var i=0; i<slotsForWeek.length; i++){
            slotsForWeek[i]=new Array(5);
        for(var j=0; j<slotsForWeek[i].length; j++){
            slotsForWeek[i][j] = false;
        }
    };

    function getDayOfTheWeek(d, i) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff+i)); //i = 0 - monday
    }

    var getSlots = function(personId) {
        var startDate = $filter('date')(getDayOfTheWeek(new Date(), 0), "dd-MM-yyyy");
        var endDate = $filter('date')(getDayOfTheWeek(new Date(), 4), "dd-MM-yyyy");

        tdprSlotsService.getSlots(startDate, endDate, personId).then(function(response){

            for(var slot in response.data){
                slotsForWeek[response.data[slot].slot.id-1][new Date(response.data[slot].slotsDate).getDay() - 1] = true;
            }

            $scope.slotsForWeek = slotsForWeek;

        });
    }
    var updateSlots = function() {
        var slots = [];
        for (var i = 0; i < slotsForWeek.length; i++) {
            for (var j = 0; j < slotsForWeek[i].length; j++) {
                if (slotsForWeek[i][j]) {
                    var slot = {
                        slotsDate: getDayOfTheWeek(new Date(), j),
                        person: {id: 1},
                        slot: {id: i + 1},
                        type: {id: 1}
                    }
                    slots.push(slot);
                }
            }
        }
        tdprSlotsService.updateSlots(slots, personId, getDayOfTheWeek(new Date(), 0), getDayOfTheWeek(new Date(), 4));
    };

    getSlots(id);

  });
});