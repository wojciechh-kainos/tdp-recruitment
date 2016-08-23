define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprScheduleService', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes,
                                                                        JobProfileEnum, Notification, tdprRecruiterSlotsService, AvailabilityEnum, WeekNavigateEnum, dateFilter, $filter, tdprScheduleService, tdprRecruiterViewPairsOfInterviewersService) {

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

        $scope.createEvent = function () {

            $scope.outlookObject.interviewers = [];

            _.forEach(persons, function(person) {
                if (person.selected) {
                    var tempPerson = {};
                    tempPerson.firstName = person.firstName;
                    tempPerson.lastName = person.lastName;
                    tempPerson.email = person.email;
                    $scope.outlookObject.interviewers.push(tempPerson);
                }
            });

            $scope.outlookObject.interviewee = "";
            $scope.outlookObject.organizer = "";
            $scope.outlookObject.start = "";
            $scope.outlookObject.end = "";
            console.log($scope.outlookObject.interviewers);
        };

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
