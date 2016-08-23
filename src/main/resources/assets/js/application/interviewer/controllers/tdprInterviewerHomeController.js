define(['angular', 'application/interviewer/tdprInterviewerModule', 'application/constants/tdprConstantsModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerHomeController", function ($scope, tdprSlotsService, tdprPersonService, $filter, $stateParams, $timeout, AvailabilityEnum, $log, $state, DateFormat, Notification) {
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
        $scope.editNote = true;

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

        function isCurrentOrFutureWeek() {
            return $scope.relativeDayNumber >= 0;
        }

        function isEligibleToEdit() {
            return isCurrentOrFutureWeek() || $scope.isRecruiter;
        }

        function replaceDashesWithDots(string) {
            return string.replace(/-/g, '.'); // ie. 15-07-1410 -> 15.07.1410
        }

        function removeSecondsFromTime(string) {
            return string.slice(0, 5); // i.e. 10:30:00 -> 10:30
        }

        function updateDate() {
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), DateFormat); // monday
            endDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber + 4), DateFormat); // friday
            $scope.displayedStartDate = replaceDashesWithDots(startDate);
            $scope.displayedEndDate = replaceDashesWithDots(endDate);
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
            tdprSlotsService.getSlotsTimes().then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    var startTime = removeSecondsFromTime(response.data[i].startTime);
                    var endTime = removeSecondsFromTime(response.data[i].endTime);
                    $scope.slotTimes.push(startTime + "-" + endTime);
                }
            });
            $scope.temporaryContent = "";

            $scope.getSlots(id);
            getNote(id, startDate);
        }

        $scope.goBackToRecruiterView = function () {
            if (!verifyNoUnsavedChanges()) {
                return;
            }

            $state.go('tdpr.recruiter.home');
        };

        $scope.discardChanges = function () {
            $scope.clearTable();
            $scope.getSlots(id);
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), DateFormat);
            getNote(id, startDate);
            $scope.hasSlotChanged = false;
            $scope.hasNoteChanged = false;
        };

        $scope.changeSlotStatus = function () {
            if (!isEligibleToEdit()) {
                Notification.error({message: 'You cannot edit slots from past weeks!', delay: 2000});
                return;
            }
            $scope.hasSlotChanged = true;
        };

       $scope.showPreviousWeek = function() {
             if(!verifyNoUnsavedChanges()){
                return;
            }

            $scope.relativeDayNumber -= 7;
            updateDate();

            $scope.clearTable();
            $scope.getSlots(id);

            getNote(id, startDate);

           if (!isEligibleToEdit()) {
               disableNoteEditing()
           }
        };

        $scope.showNextWeek = function () {
            if (!verifyNoUnsavedChanges()) {
                return;
            }

            $scope.relativeDayNumber += 7;
            updateDate();

            $scope.clearTable();
            $scope.getSlots(id);

            getNote(id, startDate);

            if (isEligibleToEdit()) {
                enableNoteEditing()
            }
        };

        function getDayOfTheWeek(d, i) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff + i)); // i = 0 - monday
        }

        $scope.updateSlots = function () {
            if (!isEligibleToEdit()) {
                Notification.error({message: 'You cannot edit slots from past weeks!', delay: 2000});
                return;
            }
            var slots = [];
            for (var i = 0; i < $scope.slotsForWeek.length; i++) {
                for (var j = 0; j < $scope.slotsForWeek[i].length; j++) {
                    if ($scope.slotsForWeek[i][j].type !== AvailabilityEnum.empty.id) {
                        var slot = {
                            slotDate: getDayOfTheWeek(new Date(), j + $scope.relativeDayNumber),
                            person: {id: id},
                            slotTime: {id: i + 1},
                            type: {id: $scope.slotsForWeek[i][j].type}
                        };
                        slots.push(slot);
                    }
                }
            }
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), DateFormat);
            endDate = $filter('date')(getDayOfTheWeek(new Date(), 5 + $scope.relativeDayNumber), DateFormat);
            tdprSlotsService.updateSlots(slots, id, startDate, endDate).then(function () {
                Notification.success({message: 'Changes saved!', delay: 2000});
            }, function (response) {
                Notification.error({message: 'Something went wrong, changes not saved', delay: 2000});
            });
            var note = createNote($scope.temporaryContent, id, $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), "yyyy-MM-dd"));

            sendNote(note);
            $scope.hasSlotChanged = false;
            $scope.hasNoteChanged = false;
        };

        function enableNoteEditing() {
            $scope.editNote = true;
        }

        function disableNoteEditing() {
            $scope.temporaryContent = $scope.noteContent.description;
            $scope.editNote = false;
        }

        function sendNote(note) {
            tdprPersonService.updateNote(note).then(function (response) {
                $scope.temporaryContent = response.data.description;
                $scope.noteContent = response.data;
            }, function (failure) {
                if (failure.status === 406) {
                    $scope.temporaryContent = $scope.noteContent.description;
                }
                Notification.warning({
                    message: 'Something went wrong with sending your note.',
                    delay: 2000
                });
            });
        }

        $scope.markSlots = function (slot) {
            if (!$scope.isRecruiter) {
                // interviewers can't change slots for past weeks or if they've got full or init scheduled
                if (!isCurrentOrFutureWeek() || isSlotTypeFullOrInit(slot)) {
                    return;
                }
            }

            slot.type === $scope.currentType ? slot.type = AvailabilityEnum.empty.id : slot.type = $scope.currentType
        };

        function isSlotTypeFullOrInit(slot) {
            return slot.type === AvailabilityEnum.full.id || slot.type === AvailabilityEnum.init.id;
        }

        $scope.goDetails = function () {
            $state.go('tdpr.interviewer.details', {'id': id});
        };

        function createNote(description, personId, date) {
            $scope.noteContent = {
                description: description,
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
            tdprPersonService.getNote(personId, date).then(function (response) {
                    if (response.status === 200) {
                        $scope.noteContent = response.data;
                        $scope.temporaryContent = response.data.description;
                    }
                }, function (failure) {
                    Notification.warning({
                        message: 'Something went wrong with getting your note.',
                        delay: 2000
                    });
                }
            )
        }

        $scope.getNoteFromPreviousWeek = function () {
            if (!isEligibleToEdit()) {
                Notification.error({message: 'You cannot edit note from past weeks!', delay: 2000});
                return;
            }
            var previousDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber - 7), DateFormat);
            tdprPersonService.getNote(id, previousDate).then(function (response) {
                if (response.status === 200) {
                    $scope.noteContent = response.data;
                    $scope.temporaryContent = response.data.description;
                    Notification.warning("Please remember to submit your note.");
                    if (response.data.description === "") Notification.warning("There was no content last week.");
                }
                else if (response.status === 204) {
                    Notification.warning("You didn't submit any notes last week.")
                } else {
                    Notification.warning({
                        message: 'Something went wrong.',
                        delay: 2000
                    });
                }
            }, function (failure) {
                Notification.warning({
                    message: 'Something went wrong with getting your note.',
                    delay: 2000
                });
            });
        };

        function verifyNoUnsavedChanges() {
            if ($scope.hasNoteChanged || $scope.hasSlotChanged) {
                Notification.warning({
                    message: 'You have changed your data. Submit or discard your changes!',
                    delay: 2000
                });
                return false;
            } else return true;
        }

        $scope.getClass = function (typeId) {
            for (var type in $scope.AvailabilityEnum) {
                if ($scope.AvailabilityEnum[type].id == typeId) {
                    return $scope.AvailabilityEnum[type].className;
                }
            }
        }

        $scope.noteHasChanged = function (){
            $scope.hasNoteChanged = true;
        }
    });
});
