define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprScheduleService', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($filter, $scope, tdprPersonsService, tdprDateService, persons, slotsTimes, tdprAuthService, tdprCandidatesService, $q,
                                                                        Notification, tdprRecruiterSlotsService, AvailabilityEnum, WeekNavigateEnum, dateFilter, tdprScheduleService, tdprRecruiterViewPairsOfInterviewersService, $state) {

        $scope.WeekNavigateEnum = WeekNavigateEnum;

        $scope.offset = $state.params.offset;
        $scope.params = $state.params;
        $scope.days = tdprDateService.getWeekWithOffset($scope.offset);
        $scope.slotsTimes = slotsTimes;
        $scope.selectSlotsTimes = slotsTimes;
        $scope.persons = persons;
        $scope.endTime = slotsTimes[slotsTimes.length - 1].endTime;
        $scope.startTime = slotsTimes[0].startTime;

        $scope.relativeDayNumber = function() {
            return $scope.offset * 7;
        };
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
                $scope.params = {};
            };

            $scope.createInterview = function () {
                var interview = tdprScheduleService.createInterview(slotsTimes, getSelectedPersons, $scope.params.candidate);

                interview.organizer = angular.copy(tdprAuthService.getCurrentUser());

                tdprScheduleService.sendInvitations(interview).then(function () {
                    return tdprCandidatesService.updateCandidate(interview.interviewee);
                }).then(function () {
                    var promises = interview.interviewers.map(function(interviewer){
                        return tdprRecruiterSlotsService.updateSlots(interviewer.slots)
                    });
                    return $q.all(promises)
                }).then(function () {
                    Notification.success('Interview scheduled');
                }).catch(function (error) {
                    Notification.error(error.message);
                });
                $scope.interviewOff();

            };

        $scope.getPairs = function(){
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

          $scope.isTableEmpty = function () {
            var persons =  $filter('jobProfileFilter')($scope.persons, $scope.currentJobProfile);
            return persons.length === 0;
          };

        });
});
