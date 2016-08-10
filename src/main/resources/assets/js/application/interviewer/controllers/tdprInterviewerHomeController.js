define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
  tdprInterviewerModule.controller("tdprInterviewerHomeController", function($scope, tdprSlotsService, $filter, $stateParams, $timeout, tdprPersonService) {

        $scope.slotTimes = [];
        $scope.displayedStartDate;
        $scope.displayedEndDate;
        $scope.slotsForWeek = new Array(18);
        var LIGHTGREYCOLOUR = 'rgb(232, 232, 232)';

        $scope.hasNoteChanged = false;
        $scope.hasSlotChanged = false;

        var note;
        var id = $stateParams.id;
        var relativeDayNumber = 0;

        var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
        var endDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber + 4), "dd-MM-yyyy");

        activate();

        function activate() {
            clearTable();
            tdprSlotsService.getSlotsTimes().then(function(response) {
                for(var i = 0; i < response.data.length; i++) {
                    var startTime = response.data[i].startTime.slice(0,5);
                    var endTime = response.data[i].endTime.slice(0,5);
                    $scope.slotTimes.push(startTime + "-" + endTime);
                }
            });

            getSlots(id, relativeDayNumber);
            getNote(id, startDate);
            $scope.textAreaStyle = {'background-color':LIGHTGREYCOLOUR};
        }

        $scope.discardChanges = function() {
            clearTable();
            getSlots(id, relativeDayNumber);
            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
            getNote(id, startDate);
            $scope.hasSlotChanged=false;
            $scope.hasNoteChanged=false;
        }

        $scope.changeSlotStatus = function() {
            $scope.hasSlotChanged = true;
        }

        $scope.editNoteSwitch = function() {
            if($scope.editNote) {
                disableNoteEditing();
            } else {
                enableNoteEditing();
            }
        }

       $scope.showPreviousWeek = function() {
            if($scope.hasNoteChanged || $scope.hasSlotChanged) {
                alert("You have changed your data. Submit or discard your changes!");
                return;
            }

            disableNoteEditing(); // set note input to disabled by default when changing weeks

            relativeDayNumber = relativeDayNumber - 7;

            clearTable();
            getSlots(id, relativeDayNumber);

            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
            getNote(id, startDate);
        }

        $scope.showNextWeek = function() {
            if($scope.hasNoteChanged || $scope.hasSlotChanged) {
                alert("You have changed your data. Submit or discard your changes!");
                return;
            }

            disableNoteEditing(); // set note input to disabled when changing weeks

            relativeDayNumber = relativeDayNumber + 7;

            clearTable();
            getSlots(id, relativeDayNumber);

            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
            getNote(id, startDate);
        }

        $scope.updateSlots = function () {
            var slots = [];
            for (var i = 0; i < $scope.slotsForWeek.length; i++) {
                for (var j = 0; j < $scope.slotsForWeek[i].length; j++) {
                    if ($scope.slotsForWeek[i][j].available) {
                        var slot = {
                            slotsDate: getDayOfTheWeek(new Date(), j + relativeDayNumber),
                            person: {id:id}, // null?
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

            var note = {
                         "id": $scope.noteContent.id,
                         "person": {
                           "id": id
                         },
                         "description": $scope.temporaryContent,
                         "date": $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "yyyy-MM-dd")
             }

            sendNote(note);
            $scope.hasSlotChanged = false;
            $scope.hasNoteChanged = false;
         };

        function enableNoteEditing() {
            $scope.hasNoteChanged = true;
            $scope.buttonTitle = "Discard";
            $scope.textAreaStyle = {'background-color':'white'};
            $scope.editNote = true;
        }

        function disableNoteEditing() {
            $scope.hasNoteChanged = false;
            $scope.buttonTitle = "Edit note";
            $scope.textAreaStyle = {'background-color':LIGHTGREYCOLOUR};
            $scope.temporaryContent = $scope.noteContent.description;
            $scope.editNote = false;
        }

        function sendNote(note) {
            tdprPersonService.updateNote(note).then(function(response) {
                if($scope.noteContent.id == response.data) console.log("Ok!");
            }, function(failure) {
                console.log(failure);
            })
        }

        function getNote(personId, date) {
            tdprPersonService.getNote(personId, date).then(function(response) {
                $scope.noteContent = response.data;
                $scope.temporaryContent = response.data.description;
                if(response.status == 204) {
                    $scope.noteContent.id = null;
                }
            }, function(failure) {
                console.log("getNote problem: Status: " + failure.status);
            })
        }

        function clearTable() {
            for(var i=0; i<$scope.slotsForWeek.length; i++){
                $scope.slotsForWeek[i]=new Array(5);
                for(var j=0; j<$scope.slotsForWeek[i].length; j++){
                    $scope.slotsForWeek[i][j] = {available: false};
                }
            };
        }

        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff+i)); //i = 0 - monday
        }

        function getSlots(personId, relDayNumber) {
            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relDayNumber), "dd-MM-yyyy");
            var endDate = $filter('date')(getDayOfTheWeek(new Date(), relDayNumber + 4), "dd-MM-yyyy");

            $scope.displayedStartDate = startDate.replace(/-/g,'.');
            $scope.displayedEndDate = endDate.replace(/-/g,'.');
            tdprSlotsService.getSlots(startDate, endDate, personId).then(function(response){

                for(var slot in response.data){
                    $scope.slotsForWeek[response.data[slot].slot.id-1][new Date(response.data[slot].slotsDate).getDay() - 1].available = true;
                }
            });
        };
    });
});