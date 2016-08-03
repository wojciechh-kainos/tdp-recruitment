define(['angular', 'js/application/tdprInterviewerModule'], function(angular, tdpInterviewerModule){
    tdpInvestModule.controller("tdprSlotsController", function($scope){

        var weekDayMap = {"Mon":0, "Tue":1, "Wed":2, "Thu":3, "Fri":4};

        var slotsForWeek = new Array(18);
        for(var i=0; i<slotsForWeek.length; i++){
                slotsForWeek[i]=new Array(5);
            for(var j=0; j<slotsForWeek[i].length; j++){
                slotsForWeek[i][j] = false;
            }
        }

        tdprSlotsService.getSlots(startDate, endDate, personId).then(function(response){
            for(var slot in response.data){
                for(day in weekDayMap){
                    if ($filter('date')(slot.day, "EEE")===day){
                        dayNumber = weekDayMap[day];
                    }
                }
                slotsForWeek[slot.id-1][dayNumber] = true;
            }
            $scope.slotsForWeek = slotsForWeek;
        });


    })
});