define(['angular', 'application/interviewer/tdprInterviewerModule', 'application/constants/tdprConstantsModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerHomeController", function ($scope, tdprSlotsService, tdprPersonService, $filter, $stateParams, $timeout, AvailabilityEnum, $log, $state, Notification) {
        $scope.slotTimes = [];

        $scope.hasNoteChanged = false;
        $scope.hasSlotChanged = false;
        $scope.relativeDayNumber = 0;
        $scope.slotsForWeek = new Array(18);
        $scope.AvailabilityEnum = AvailabilityEnum;
        $scope.currentType = AvailabilityEnum.available.id;
        $scope.mousedown = false;
        $scope.isRecruiter = $state.params.isRecruiter;
        $scope.personName = $state.params.personName;
        $scope.editNote = false;
        $scope.buttonTitle = 'Edit note';

        var note;
        var id = $stateParams.id;

        var startDate;
        var endDate;

        $scope.clearTable = function () {
            for (var i = 0; i < $scope.slotsForWeek.length; i++) {
                $scope.slotsForWeek[i] = new Array(5);
                for (var j = 0; j < $scope.slotsForWeek[i].length; j++) {
                    $scope.slotsForWeek[i][j] = {type: AvailabilityEnum.empty.id};
                }
            }
        };

        function updateDate(){
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), "dd-MM-yyyy");
            endDate  = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber + 4), "dd-MM-yyyy");
            $scope.displayedStartDate = startDate.replace(/-/g,'.');
            $scope.displayedEndDate = endDate.replace(/-/g,'.');
        }

        $scope.getSlots = function (personId) {
            tdprSlotsService.getSlots(startDate, endDate, personId).then(function (response) {
                for (var slot in response.data) {
                    $scope.slotsForWeek[response.data[slot].number - 1][new Date(response.data[slot].day).getDay() - 1].type = String(AvailabilityEnum[response.data[slot].type].id);
                }
            });
        };

        activate();

        function activate() {
            $scope.clearTable();
            updateDate();
            tdprSlotsService.getSlotsTimes().then(function(response) {
                for(var i = 0; i < response.data.length; i++) {
                    var startTime = response.data[i].startTime.slice(0,5);
                    var endTime = response.data[i].endTime.slice(0,5);
                    $scope.slotTimes.push(startTime + "-" + endTime);
                }
            });
            $scope.temporaryContent = "";

            $scope.getSlots(id);
            getNote(id, startDate);
        }

        $scope.goBackToRecruiterView = function(){
            $state.go('tdpr.recruiter.home');
        };

        $scope.discardChanges = function() {
            $scope.clearTable();
            $scope.getSlots(id);
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), "dd-MM-yyyy");
            getNote(id, startDate);
            $scope.hasSlotChanged=false;
            $scope.hasNoteChanged=false;
        };

        $scope.changeSlotStatus = function() {
            if($scope.relativeDayNumber<0 && !$scope.isRecruiter){
                Notification.error({message: 'You cannot edit slots from past weeks!', delay: 2000});
                return;
            }
            $scope.hasSlotChanged = true;
        };

        $scope.editNoteSwitch = function() {
            if($scope.editNote) {
                disableNoteEditing();
            } else {
                enableNoteEditing();
            }
        };

       $scope.showPreviousWeek = function() {
             if(!verifyNoUnsavedChanges()){
                return;
             }

            disableNoteEditing(); // set note input to disabled by default when changing weeks

            $scope.relativeDayNumber -= 7;
            updateDate();

            $scope.clearTable();
            $scope.getSlots(id);

            getNote(id, startDate);
        };

        $scope.showNextWeek = function() {
            if(!verifyNoUnsavedChanges()){
                return;
            }

            disableNoteEditing(); // set note input to disabled when changing weeks

            $scope.relativeDayNumber += 7;
            updateDate();

            $scope.clearTable();
            $scope.getSlots(id);

            getNote(id, startDate);
        };

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
                            slotsDate: getDayOfTheWeek(new Date(), j + $scope.relativeDayNumber),
                            person: {id:id},
                            slot: {id: i + 1},
                            type: {id: $scope.slotsForWeek[i][j].type}
                        };
                        slots.push(slot);
                    }
                }
            }
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), "dd-MM-yyyy");
            endDate = $filter('date')(getDayOfTheWeek(new Date(), 5 + $scope.relativeDayNumber), "dd-MM-yyyy");
            tdprSlotsService.updateSlots(slots, id, startDate, endDate).then(function () {
                Notification.success({message: 'Changes saved!', delay: 2000});
            }, function(){
                Notification.error({message: 'You cannot edit slots from past weeks!', delay: 2000});
            });

            var note = createNote($scope.temporaryContent, id, $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), "yyyy-MM-dd"));

            sendNote(note);
            $scope.hasSlotChanged = false;
            $scope.hasNoteChanged = false;
        };

        function enableNoteEditing() {
            $scope.hasNoteChanged = true;
            $scope.buttonTitle = "Discard";
            $scope.editNote = true;
        }

        function disableNoteEditing() {
            $scope.hasNoteChanged = false;
            $scope.buttonTitle = "Edit note";
            $scope.temporaryContent = $scope.noteContent.description;
            $scope.editNote = false;
        }

        function sendNote(note) {
            tdprPersonService.updateNote(note).then(function(response) {
                $scope.temporaryContent = response.data.description;
                $scope.noteContent = response.data;
            }, function(failure) {
                if(failure.status === 406) {
                    $scope.temporaryContent = $scope.noteContent.description;
                }
                    Notification.warning({
                        message: 'Something went wrong with sending your note.',
                        delay: 2000});
            });
        }

        $scope.markSlots = function(slot) {
            if($scope.relativeDayNumber < 0 && !$scope.isRecruiter){
                return;
            }
            slot.type === $scope.currentType ? slot.type = AvailabilityEnum.empty.id : slot.type = $scope.currentType
        };
        $scope.goDetails = function(){
              $state.go('tdpr.interviewer.details', {'id' : id});
        };

        function createNote(description, personId, date) {
            $scope.noteContent = {
                description : description,
                person: {
                    id: personId
                },
                date: date
            };
            $scope.temporaryContent = "";
            return $scope.noteContent;
        }

        function getNote(personId, date) {
            createNote("", personId, date);
            tdprPersonService.getNote(personId, date).then(function(response) {
                if(response.status === 200) {
                    $scope.noteContent = response.data;
                    $scope.temporaryContent = response.data.description;
                }
            }, function() {
                Notification.warning({
                   message: 'Something went wrong with getting your note.',
                   delay: 2000});
               }
        )}

       $scope.getNoteFromPreviousWeek = function() {
            var previousDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber - 7 ), "dd-MM-yyyy");
            tdprPersonService.getNote(id, previousDate).then(function(response) {
                 if(response.status === 200) {
                    $scope.noteContent = response.data;
                    $scope.temporaryContent = response.data.description;
                    Notification.warning("Please remember to submit your note.");
                    if(response.data.description === "") Notification.warning("There was no content last week.");
                }
                else if (response.status === 204){
                    Notification.warning("You didn't submit any notes last week.")
                } else {
                     Notification.warning({
                        message: 'Something went wrong.',
                        delay: 2000});
                }
            },function() {
                   Notification.warning({
                      message: 'Something went wrong with getting your note.',
                      delay: 2000});
             });
           enableNoteEditing();
        };

        function verifyNoUnsavedChanges() {
            if($scope.hasNoteChanged || $scope.hasSlotChanged) {
                Notification.warning({
                    message: 'You have changed your data. Submit or discard your changes!',
                    delay: 2000});
                return false;
            } else return true;
        }
    });
});
