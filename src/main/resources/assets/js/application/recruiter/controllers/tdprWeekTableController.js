define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprScheduleService', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes,
                                                                        Notification, tdprRecruiterSlotsService, AvailabilityEnum, WeekNavigateEnum, dateFilter, $filter, tdprScheduleService, tdprRecruiterViewPairsOfInterviewersService, $state) {

            var that = this;

            $scope.WeekNavigateEnum = WeekNavigateEnum;
            $scope.params = $state.params;
            $scope.days = tdprDateService.getCurrentWeek();
            $scope.slotsTimes = slotsTimes;
            $scope.selectSlotsTimes = slotsTimes;
            $scope.persons = persons;
            $scope.endTime = slotsTimes[slotsTimes.length - 1].endTime;
            $scope.startTime = slotsTimes[0].startTime;
            $scope.interviewMode = "full";

            var getInterviewMode = function () {
                return $scope.interviewMode;
            };

            var getSelectedPersons = function () {
                return _.filter($scope.persons, function (person) {
                    return person.selected;
                });
            };

            if ($scope.params.candidateId && $scope.params.candidateId !== 0) {
                $scope.pairingMode = true;
                $scope.changeSlotTypeCycleThrough = tdprScheduleService.tripleSlotChange(_.maxBy(slotsTimes, 'id').id, getSelectedPersons, getInterviewMode);
            } else {
                $scope.pairingMode = false;
                $scope.changeSlotTypeCycleThrough = tdprScheduleService.changeSlotTypeCycleThrough;
            }

            $scope.interviewOff = function () {
                $scope.pairingMode = false;
                $scope.changeSlotTypeCycleThrough = tdprScheduleService.changeSlotTypeCycleThrough;
                $scope.refreshPersonsData();
            };

            $scope.createInterview = function () {
                var data = tdprScheduleService.createInterview(slotsTimes, getSelectedPersons, $scope.params.candidate);
                if (data) {
                    $state.go("tdpr.recruiter.createInterview",
                        {data: data});

                }
            };

            $scope.getPairs = function () {
                tdprRecruiterViewPairsOfInterviewersService.getPairs([$scope.currentJobProfile], $scope.displayedStartDate, $scope.displayedEndDate, $scope.startTime, $scope.endTime).then(
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

            $scope.changeSlotDiscardChanges = tdprScheduleService.changeSlotDiscardChanges;
        }
    );
});
