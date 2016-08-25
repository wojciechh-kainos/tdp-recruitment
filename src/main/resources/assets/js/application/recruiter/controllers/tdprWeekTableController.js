define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprScheduleService', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, $state,
                                                                        Notification, tdprRecruiterSlotsService, AvailabilityEnum, WeekNavigateEnum, dateFilter, $filter, tdprScheduleService, tdprRecruiterViewPairsOfInterviewersService) {

        var that = this;


        $scope.pairingMode = false;
        $scope.WeekNavigateEnum = WeekNavigateEnum;

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.selectSlotsTimes = slotsTimes;
        $scope.persons = persons;
        $scope.endTime = slotsTimes[slotsTimes.length - 1].endTime;
        $scope.startTime = slotsTimes[0].startTime;

        var getSelectedPersons = function() {
            return _.filter($scope.persons, function (person) {
                return person.selected;
            });
        };

        var deselectPersons = function() {
            _.each(getSelectedPersons(), function(person) {
                person.selected = false;
            });
        };
        $scope.interviewOn = function () {
            $scope.pairingMode = true;
            $scope.changeSlotTypeCycleThrough = tdprScheduleService.tripleSlotChange(_.maxBy(slotsTimes, 'id').id, getSelectedPersons);
        };
        
        $scope.interviewOff = function () {
            $scope.pairingMode = false;
            $scope.changeSlotTypeCycleThrough = tdprScheduleService.changeSlotTypeCycleThrough;
            deselectPersons();
            console.log($scope.pairingMode);

        };

        $scope.createInterview = function() {
            $state.go("tdpr.recruiter.createEvent",
                {data: tdprScheduleService.createInterview(slotsTimes, getSelectedPersons)});
        };
        
        $scope.getPairs = function () {
            tdprRecruiterViewPairsOfInterviewersService.getPairs([$scope.currentJobProfile], $scope.displayedStartDate, $scope.displayedEndDate).then(
                function (persons) {
                    $scope.persons = persons;
                }
            ).catch(function () {
                Notification.error("Failed to get pairs");
            });
        };

        $scope.filterSlots = function () {
            $scope.slotsTimes = $filter('slotsByTime')(slotsTimes, $scope.startTime, $scope.endTime);
        };

        $scope.displayedStartDate = $scope.days[0];
        $scope.displayedEndDate = $scope.days[4];

        $scope.offset = WeekNavigateEnum.current;

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

            tdprRecruiterSlotsService.updateSlots(personData.slotList).then(
                function () {
                    personData.slotList.forEach(function (slot) {
                        slot.changed = false;
                    });
                    personData.changesPending = false;
                    Notification.success('Your changes were saved successfully!');
                }
            ).catch(
                function (status) {
                    Notification.error(status.message);
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
                Notification.error("Failed to refresh persons data");
            });
        };
        $scope.changeSlotTypeCycleThrough = tdprScheduleService.changeSlotTypeCycleThrough;
        $scope.changeSlotDiscardChanges = tdprScheduleService.changeSlotDiscardChanges;
    });
});
