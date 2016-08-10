define(['angular', 'application/interviewer/tdprInterviewerModule', 'application/constants/tdprConstantsModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerHomeController", function ($scope, tdprSlotsService,tdprPersonService, $filter, $stateParams, $timeout, AvailabilityEnum, $log) {
        $scope.slotTimes = [];

        $scope.displayedStartDate;
        $scope.displayedEndDate;
        var LIGHTGREYCOLOUR = 'rgb(232, 232, 232)';

        $scope.hasNoteChanged = false;
        $scope.hasSlotChanged = false;
        $scope.startDate;
        $scope.endDate;
        $scope.relativeDayNumber = 0;
        $scope.slotsForWeek = new Array(18);
        $scope.AvailabilityEnum = AvailabilityEnum;
        $scope.currentType = AvailabilityEnum.available.id;
        $scope.mousedown = false;

        $scope.$log = $log;

        var note;
        var id = $stateParams.id;
        var relativeDayNumber = 0;

        var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
        var endDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber + 4), "dd-MM-yyyy");


        $scope.clearTable = function () {
            for (var i = 0; i < $scope.slotsForWeek.length; i++) {
                $scope.slotsForWeek[i] = new Array(5);
                for (var j = 0; j < $scope.slotsForWeek[i].length; j++) {
                    $scope.slotsForWeek[i][j] = {type: AvailabilityEnum.empty.id};
                }
            }
        };

        $scope.getSlots = function (personId) {
            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
            var endDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber + 4), "dd-MM-yyyy");

            $scope.startDate = startDate;
            $scope.endDate = endDate;
            $scope.displayedStartDate = startDate.replace(/-/g,'.');
            $scope.displayedEndDate = endDate.replace(/-/g,'.');
            tdprSlotsService.getSlots(startDate, endDate, personId).then(function (response) {
                for (var slot in response.data) {
                    $scope.slotsForWeek[response.data[slot].slot.id - 1][new Date(response.data[slot].slotsDate).getDay() - 1].type = String(response.data[slot].type.id);
                }
            });
        };

        activate();

        function activate() {
            $scope.clearTable();
            tdprSlotsService.getSlotsTimes().then(function(response) {
                for(var i = 0; i < response.data.length; i++) {
                    var startTime = response.data[i].startTime.slice(0,5);
                    var endTime = response.data[i].endTime.slice(0,5);
                    $scope.slotTimes.push(startTime + "-" + endTime);
                }
            });

            $scope.getSlots(id);
            getNote(id, startDate);
            $scope.textAreaStyle = {'background-color':LIGHTGREYCOLOUR};
        }

        $scope.discardChanges = function() {
            $scope.clearTable();
            $scope.getSlots(id);
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

            $scope.clearTable();
            $scope.getSlots(id);

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

            $scope.clearTable();
            $scope.getSlots(id);

            var startDate = $filter('date')(getDayOfTheWeek(new Date(), relativeDayNumber), "dd-MM-yyyy");
            getNote(id, startDate);
        }

        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff + i)); // i = 0 - monday
        }

        $scope.updateSlots = function () {
            var slots = [];
            for (var i = 0; i < $scope.slotsForWeek.length; i++) {
                for (var j = 0; j < $scope.slotsForWeek[i].length; j++) {
                    if ($scope.slotsForWeek[i][j].type !== AvailabilityEnum.empty.id) {
                        var slot = {
                            slotsDate: getDayOfTheWeek(new Date(), j + relativeDayNumber),
                            person: {id:id}, // null?
                            slot: {id: i + 1},
                            type: {id: $scope.slotsForWeek[i][j].type}
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
            }, function(failure) {
                console.log(failure);
            });
        }

        $scope.markSlots = function(slot) {
            slot.type === $scope.currentType ? slot.type = AvailabilityEnum.empty.id : slot.type = $scope.currentType
        };

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


        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff+i)); //i = 0 - monday
        }

    });
});
