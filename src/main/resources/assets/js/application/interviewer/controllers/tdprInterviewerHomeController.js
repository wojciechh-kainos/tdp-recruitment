define(['angular', 'application/interviewer/tdprInterviewerModule', 'application/constants/tdprConstantsModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerHomeController", function ($scope, tdprSlotsService, tdprAuthService, tdprPersonService, $filter, $stateParams, $timeout, AvailabilityEnum, $log, $state, DateFormat, Notification) {
        $scope.slotTimes = [];

        $scope.hasNoteChanged = false;
        $scope.hasSlotChanged = false;
        $scope.relativeDayNumber = 0;
        $scope.slotsForWeek = [];
        $scope.AvailabilityEnum = AvailabilityEnum;
        $scope.currentType = AvailabilityEnum.available.id;
        $scope.mousedown = false;
        $scope.isRecruiter = $state.params.isRecruiter;
        $scope.personName = $state.params.personName;
        $scope.viewingMyDetails = tdprAuthService.getCurrentUser().id == $stateParams.id;
        $scope.editNote = true;

        var note;
        var id = $stateParams.id;

        var startDate;
        var endDate;

        $scope.clearTable = function () {
            for (var i = 0; i < $scope.slotTimes.length; i++) {
                $scope.slotsForWeek[i] = new Array(5);
                for (var j = 0; j < 5; j++) {
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

        function removeSecondsFromTime(string) {
            return string.slice(0, 5); // i.e. 10:30:00 -> 10:30
        }

        function updateDate() {
            if ($stateParams.relativeDayNumber && $stateParams.relativeDayNumber != 0) {
                $scope.relativeDayNumber = $stateParams.relativeDayNumber;
                $stateParams.relativeDayNumber = 0;
            }
            startDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber), DateFormat); // monday
            endDate = $filter('date')(getDayOfTheWeek(new Date(), $scope.relativeDayNumber + 4), DateFormat); // friday
            $scope.displayedStartDate = startDate;
            $scope.displayedEndDate = endDate;
        }

        $scope.getSlots = function (personId) {
            tdprSlotsService.getSlots(startDate, endDate, personId).then(function (response) {
                response.data.forEach(function (slot) {
                    $scope.slotsForWeek[slot.number - 1][new Date(slot.day).getDay() - 1].type = String(AvailabilityEnum[slot.type].id);
                })
            });
        };

        function activate() {
            updateDate();
            tdprSlotsService.getSlotsTimes().then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    var startTime = removeSecondsFromTime(response.data[i].startTime);
                    var endTime = removeSecondsFromTime(response.data[i].endTime);
                    $scope.slotTimes.push(startTime + "-" + endTime);
                }
            }).then(function () {
                $scope.clearTable();
                $scope.temporaryContent = "";
                $scope.getSlots(id);
            });

            getNote(id, startDate);
        }

        activate();

        var relativeDayNumberToOffset = function () {
            return $scope.relativeDayNumber / 7;
        };

        $scope.goBackToRecruiterView = function () {
            if (!verifyNoUnsavedChanges()) {
                return;
            }

            $state.go('tdpr.recruiter.home', {offset: relativeDayNumberToOffset()});
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
                Notification.error('You cannot edit slots from past weeks!');
                return;
            }
            $scope.hasSlotChanged = true;
        };

        $scope.showPreviousWeek = function () {
            if (!verifyNoUnsavedChanges()) {
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
                Notification.error('You cannot edit slots from past weeks!');
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
                Notification.success('Changes saved!');
            }, function (response) {
                Notification.error('Something went wrong, changes not saved');
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
                Notification.warning('Something went wrong with sending your note.');
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
                    Notification.warning('Something went wrong with getting your note.');
                }
            )
        }

        $scope.getNoteFromPreviousWeek = function () {
            if (!isEligibleToEdit()) {
                Notification.error('You cannot edit note from past weeks!');
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
                    Notification.warning('Something went wrong.');
                }
            }, function (failure) {
                Notification.warning('Something went wrong with getting your note.');
            });
        };

        function verifyNoUnsavedChanges() {
            if ($scope.hasNoteChanged || $scope.hasSlotChanged) {
                Notification.warning('You have changed your data. Submit or discard your changes!');
                return false;
            } else return true;
        }

        $scope.getClass = function (typeId) {
            for (var type in $scope.AvailabilityEnum) {
                if ($scope.AvailabilityEnum[type].id == typeId) {
                    return $scope.AvailabilityEnum[type].className;
                }
            }
        };

        $scope.noteHasChanged = function () {
            $scope.hasNoteChanged = true;
        }
    });
});
