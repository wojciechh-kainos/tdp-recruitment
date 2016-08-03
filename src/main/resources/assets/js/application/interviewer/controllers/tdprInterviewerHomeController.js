define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
  tdprInterviewerModule.controller("tdprInterviewerHomeController", function($scope, tdprSlotsService, $filter) {
    $scope.slotTimes = ["9.00-9.30", "9.30-10.00", "10.00-10.30", "10.30-11.00", "11.00-11.30", "11.30-12.00", "12.00-12.30",
     "12.30-13.00", "13.00-13.30", "13.30-14.00", "14.00-14.30", "14.30-15.00", "15.00-15.30", "15.30-16.00", "16.00-16.30","16.30-17.00", "17.00-17.30", "17.30-18.00"];
//    $scope.slotsForWeek=[[false,true,true,true,false],
//    [false,true,true,true,false],
//    [false,true,true,true,false],
//    [false,true,true,true,false]
//    ];


    var weekDayMap = {"Mon":0, "Tue":1, "Wed":2, "Thu":3, "Fri":4};

    var slotsForWeek = new Array(18);
    for(var i=0; i<slotsForWeek.length; i++){
            slotsForWeek[i]=new Array(5);
        for(var j=0; j<slotsForWeek[i].length; j++){
            slotsForWeek[i][j] = false;
        }
    };

    var getSlots = function(personId) {
//        var startDate = $filter('date')(getMonday(new Date()), "dd-MM-yyyy");
//        var endDate = $filter('date')(getMonday(new Date()), "dd-MM-yyyy");
        var startDate = "01-08-2016";
        var endDate = "06-08-2016";
         tdprSlotsService.getSlots(startDate, endDate, personId).then(function(response){

            for(var slot in response.data){
            var dayNumber;
                for(day in weekDayMap){
                    if ($filter('date')(slot.day, "EEE")===day){
                        slotsForWeek[slot.id-1][weekDayMap[day]] = true;
                    }
                }

            }
          
            $scope.slotsForWeek = slotsForWeek;

        });
    }

    getSlots(1);
  });
});