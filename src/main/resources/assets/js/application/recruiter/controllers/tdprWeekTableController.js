define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprScheduleService', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, $state,
                                                                        JobProfileEnum, Notification, tdprRecruiterSlotsService, AvailabilityEnum,
                                                                        WeekNavigateEnum, dateFilter, $filter, tdprScheduleService, tdprRecruiterViewPairsOfInterviewersService) {
        var that = this;
        $scope.pairingMode = false;
        $scope.outlookObject = {};

        $scope.JobProfileEnum = JobProfileEnum;
        $scope.currentJobProfile = JobProfileEnum.dev;
        $scope.WeekNavigateEnum = WeekNavigateEnum;

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.selectSlotsTimes = slotsTimes;
        $scope.persons = persons;
        $scope.endTime = slotsTimes[slotsTimes.length - 1].endTime;
        $scope.startTime = slotsTimes[0].startTime;

        this.validateSlotList = function (slotList) {
            if (slotList.length === 0 || slotList.length > 3) return false;
            var min = _.minBy(slotList, 'number');
            var max = _.maxBy(slotList, 'number');
            return max.number - min.number == 2;
        };

        $scope.createEvent = function () {

            var selectedPersons = _.filter(persons, function (person) {
                return person.selected;
            });

            // This code was hard to write, it is supposed to be hard to read!
            var sharedSlots = _.unionBy(_.flatten(_.map(selectedPersons, function (person) {
                return _.xorBy(person.oldSlotList, person.slotsList, 'number');
            })), 'number');

            if (that.validateSlotList(sharedSlots)) {
                $scope.outlookObject.interviewers = _.map(selectedPersons, function (obj) {
                    return {
                        firstName: obj.firstName,
                        lastName: obj.lastName,
                        email: obj.email
                    }
                });

                var day = sharedSlots[0].day;
                var startSlot = _.find(slotsTimes, {id: _.minBy(sharedSlots, 'number').number});
                var endSlot = _.find(slotsTimes, {id: _.maxBy(sharedSlots, 'number').number});
                var eventStartTime = getISODateString(day, startSlot.startTime);
                var eventEndTime = getISODateString(day, endSlot.endTime);

                $scope.outlookObject.interviewee = "";
                $scope.outlookObject.organizer = "";
                $scope.outlookObject.start = eventStartTime;
                $scope.outlookObject.end = eventEndTime;

                $state.go("tdpr.recruiter.createEvent", {data: $scope.outlookObject})

            }
        };

        function getISODateString(day, hour) {
            var date = new Date(day);
            var parts = hour.split(":");
            date.setHours(parts[0]);
            date.setMinutes(parts[1]);
            date.setSeconds(parts[2]);
            return date.toISOString();
        }

        $scope.getPairs = function () {
            tdprRecruiterViewPairsOfInterviewersService.getPairs([$scope.currentJobProfile], $scope.displayedStartDate, $scope.displayedEndDate).then(
                function (persons) {
                    $scope.persons = persons;
                }
            ).catch(function () {
                Notification.error({message: "Failed to get pairs", delay: 3000});
            });
        };

        $scope.filterSlots = function () {
            $scope.slotsTimes = $filter('slotsByTime')(slotsTimes, $scope.startTime, $scope.endTime);
        };

        $scope.displayedStartDate = $scope.days[0];
        $scope.displayedEndDate = $scope.days[4];

        $scope.offset = 0;

        $scope.changeWeek = function (offset) {

            if (offset === WeekNavigateEnum.current) {
                $scope.offset = WeekNavigateEnum.current;
            } else {
                $scope.offset += offset;
            }

            $scope.days = tdprDateService.getWeekWithOffset($scope.offset);
            tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(function (data) {
                $scope.persons = data;
            });
            $scope.displayedStartDate = $scope.days[0];
            $scope.displayedEndDate = $scope.days[4];
        };

        $scope.changeSlotSubmitChanges = function (personData) {
            var endDate = new Date($scope.days[4]);
            endDate.setDate(endDate.getDate() + 1);

            tdprRecruiterSlotsService.updateSlots(personData.slotsList, personData.id, $scope.days[0], endDate).then(
                function () {
                    personData.changesPending = false;
                    Notification.success({message: 'Your changes were saved successfully!', delay: 3500});
                }
            ).catch(
                function (status) {
                    Notification.error({message: status.message, delay: 3500});
                }
            );
        };

        $scope.refreshPersonsData = function () {
            $scope.endTime = slotsTimes[slotsTimes.length - 1].endTime;
            $scope.startTime = slotsTimes[0].startTime;
            $scope.filterSlots();

            tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(
                function (persons) {
                    $scope.persons = persons;
                }
            ).catch(function () {
                Notification.error({message: "Failed to refresh persons data", delay: 3000});
            });
        };

        $scope.changeSlotTypeCycleThrough = tdprScheduleService.changeSlotTypeCycleThrough;
        $scope.changeSlotDiscardChanges = tdprScheduleService.changeSlotDiscardChanges;
    });
});
