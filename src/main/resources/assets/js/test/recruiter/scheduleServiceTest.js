define(['angular', 'angularMocks',
    'lodash',
    'notification',
    'application/recruiter/controllers/tdprWeekTableController',
    'application/recruiter/services/tdprDateService',
    'application/recruiter/services/tdprScheduleService',
    'application/recruiter/services/tdprRecruiterSlotsService'], function (angular) {
    describe('scheduleServiceTest', function () {
        'use strict';

        var slotsTimes;

        var $state;
        var $scope;

        var $httpBackend;
        var dateFilter;
        var tdprDateService;
        var tdprWeekTableController;
        var tdprRecruiterSlotsService;
        var AvailabilityEnum;

        var person;
        var $q;
        var persons;

        var weekStart;
        var weekStartString;
        var weekEnd;
        var weekEndString;
        var testSlotId;
        var testDay;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(function () {
            module('tdprRecruiterModule', function ($provide) {
                $provide.constant('AvailabilityEnum', {
                    empty: {
                        id: '0',
                        name: "empty",
                        className: "cell-avail-empty",
                        tooltipText: ""
                    },
                    available: {
                        id: '1',
                        name: "available",
                        className: "cell-avail-available",
                        tooltipText: "available"
                    },
                    full: {
                        id: '2',
                        name: "full",
                        className: "cell-avail-full",
                        tooltipText: "full"
                    },
                    init: {
                        id: '3',
                        name: "init",
                        className: "cell-avail-init",
                        tooltipText: "init call"
                    },
                    unavailable: {
                        id: '4',
                        name: "unavailable",
                        className: "cell-avail-unavailable",
                        tooltipText: ""
                    },
                    maybe: {
                        id: '5',
                        name: "maybe",
                        className: "cell-avail-maybe",
                        tooltipText: "maybe "
                    }
                });

                $provide.constant('JobProfileEnum', {
                    dev: "isDev",
                    web: "isWeb",
                    test: "isTest"
                });

                $provide.constant('Notification',
                    {
                        delay: 5000,
                        startTop: 10,
                        startRight: 10,
                        verticalSpacing: 10,
                        horizontalSpacing: 10,
                        positionX: 'right',
                        positionY: 'top',
                        replaceMessage: false,
                        templateUrl: 'angular-ui-notification.html',
                        onClose: undefined,
                        closeOnClick: true,
                        maxCount: 0 // 0 - Infinite

                    });

            });

            slotsTimes = [{"id": 1, "startTime": "08:00:00", "endTime": "08:30:00"},
                {"id": 2, "startTime": "08:30:00", "endTime": "09:00:00"},
                {"id": 3, "startTime": "09:00:00", "endTime": "09:30:00"},
                {"id": 4, "startTime": "09:30:00", "endTime": "10:00:00"},
                {"id": 5, "startTime": "10:00:00", "endTime": "10:30:00"},
                {"id": 6, "startTime": "10:30:00", "endTime": "11:00:00"},
                {"id": 7, "startTime": "11:00:00", "endTime": "11:30:00"},
                {"id": 8, "startTime": "11:30:00", "endTime": "12:00:00"},
                {"id": 9, "startTime": "12:00:00", "endTime": "12:30:00"},
                {"id": 10, "startTime": "12:30:00", "endTime": "13:00:00"},
                {"id": 11, "startTime": "13:00:00", "endTime": "13:30:00"},
                {"id": 12, "startTime": "13:30:00", "endTime": "14:00:00"},
                {"id": 13, "startTime": "14:00:00", "endTime": "14:30:00"},
                {"id": 14, "startTime": "14:30:00", "endTime": "15:00:00"},
                {"id": 15, "startTime": "15:00:00", "endTime": "15:30:00"},
                {"id": 16, "startTime": "15:30:00", "endTime": "16:00:00"},
                {"id": 17, "startTime": "16:00:00", "endTime": "16:30:00"},
                {"id": 18, "startTime": "16:30:00", "endTime": "17:00:00"}];

            person = {
                "activationCode": null,
                "active": false,
                "admin": false,
                "bandLevel": 1,
                "email": "test@test.pl",
                "firstName": "Test",
                "id": 1,
                "isDev": true,
                "isTest": false,
                "isWeb": false,
                "lastName": "Test",
                "password": null,
                "slotsList": null
            };

            persons = [person];
        });

        beforeEach(inject(function ($controller, _$q_, _$rootScope_, _$state_, _$filter_, _$httpBackend_, _dateFilter_, _tdprPersonsService_, _tdprDateService_, _JobProfileEnum_, _Notification_, _tdprRecruiterSlotsService_, _AvailabilityEnum_) {
            $state = _$state_;
            $scope = _$rootScope_.$new();

            $q = _$q_;


            $httpBackend = _$httpBackend_;
            dateFilter = _dateFilter_;
            tdprDateService = _tdprDateService_;
            tdprRecruiterSlotsService = _tdprRecruiterSlotsService_;
            AvailabilityEnum = _AvailabilityEnum_;

            tdprWeekTableController = $controller('tdprWeekTableController', {
                $scope: $scope,
                tdprPersonsService: _tdprPersonsService_,
                tdprDateService: _tdprDateService_,
                persons: persons,
                slotsTimes: slotsTimes,
                JobProfileEnum: _JobProfileEnum_,

                tdprRecruiterSlotsService: tdprRecruiterSlotsService,
                AvailabilityEnum: AvailabilityEnum,
                dateFilter: dateFilter,
                Notification: _Notification_
            });
        }));

        beforeEach(function () {
            var format = 'yyyy-MM-dd';
            var requestFormat = 'dd-MM-yyyy';
            var now = new Date();
            weekStart = new Date();
            weekStart.setDate(now.getDate() - now.getDay() + 1);

            weekStart = dateFilter(weekStart, format);
            weekStartString = dateFilter(weekStart, requestFormat);

            weekEnd = new Date();
            weekEnd.setDate(now.getDate() + (7 - now.getDay()));

            weekEnd = dateFilter(weekEnd, format);
            weekEndString = dateFilter(weekEnd, requestFormat);


            testSlotId = 8;
            testDay = weekStart;
        });

        describe('changeSlotTypeCycleThrough', function () {
            it('should create put request with new added full slot at number 8', function () {

                person.slotsList = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    }
                ];

                // These are slots which should be formatted after request
                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.full.name
                    }
                ], person.id);


                $httpBackend.expect('PUT', '/api/slots/' + weekStartString + '/' + weekEndString  + '?personId=' + person.id, expectedSlots).respond(200);


                $scope.changeSlotTypeCycleThrough(undefined, testSlotId, testDay, person);
                tdprRecruiterSlotsService.updateSlots(person.slotsList, person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });


            it('should create put request with changed slot at number 8 from available to full', function () {

                person.slotsList = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.available.name
                    }

                ];

                // These are slots which should be formatted after request
                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.full.name
                    }
                ], person.id);

                $httpBackend.expect('PUT', '/api/slots/' + weekStartString + '/' + weekEndString  + '?personId=' + person.id, expectedSlots).respond(200);

                $scope.changeSlotTypeCycleThrough(person.slotsList[2], testSlotId, testDay, person);
                tdprRecruiterSlotsService.updateSlots(person.slotsList, person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

            it('should create put request with init call change to full at slot number 8', function () {

                person.slotsList = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.init.name
                    }
                ];

                // These are slots which should be formatted after request
                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.full.name
                    }
                ], person.id);

                $httpBackend.expect('PUT', '/api/slots/' + weekStartString + '/' + weekEndString  + '?personId=' + person.id, expectedSlots).respond(200);

                $scope.changeSlotTypeCycleThrough(person.slotsList[2], testSlotId, weekStart, person);
                tdprRecruiterSlotsService.updateSlots(person.slotsList, person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        });

        describe('discardSlotChanges', function() {

            it('should revert changes made to slotList', function () {
                person.slotsList = [{
                    "day": weekStart,
                    "number": 7,
                    "type": AvailabilityEnum.available.name
                }];
                var startList = angular.copy(person.slotsList);

                $scope.changeSlotTypeCycleThrough(person.slotsList[0], 7, weekStart, person);
                $scope.changeSlotDiscardChanges(person);

                expect(startList).toEqual(person.slotsList);

            });
        });

        describe('changeSlotTypeCycleThrough - filtering, response statuses', function () {

            it('should create put request with change slot number 8 from full to init state and filter for only one day', function () {

                person.slotsList = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.full.name
                    }

                ];

                // These are slots which should be formatted after request
                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.init.name
                    }
                ], person.id);

                $httpBackend.expect('PUT', '/api/slots/' + weekStartString + '/' + weekEndString  + '?personId=' + person.id, expectedSlots).respond(200);

                $scope.changeSlotTypeCycleThrough(person.slotsList[1], testSlotId, weekStart, person);
                tdprRecruiterSlotsService.updateSlots(tdprRecruiterSlotsService.filterSlots(person.slotsList, weekStart), person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

            it('should create put request which resolves with "NOT_ACCEPTABLE" 406 error - changing slots from past', function () {

                person.slotsList = [
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 8,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.init.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.full.name
                    }

                ];

                // These are slots which should be formatted after request
                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.init.name
                    }
                ], person.id);


                $httpBackend.expect('PUT', '/api/slots/' + weekStartString + '/' + weekStartString + '?personId=' + person.id, expectedSlots).respond(406);

                $scope.changeSlotTypeCycleThrough(person.slotsList[4], testSlotId, weekStart, person);
                tdprRecruiterSlotsService.updateSlots(tdprRecruiterSlotsService.filterSlots(person.slotsList, weekStart), person.id, weekStart, weekStartString).then(function (response) {
                    expect(response.status).toEqual(406);
                });

                $httpBackend.flush();
            });

            it('should create put request which resolves with 200 status - changing slots in future', function () {

                person.slotsList = [
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.init.name
                    },
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "number": 8,
                        "type": AvailabilityEnum.full.name
                    }

                ];

                // These are slots which should be formatted after request
                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": 9,
                        "type": AvailabilityEnum.init.name
                    },
                    {
                        "day": weekEnd,
                        "person": 9,
                        "number": testSlotId,
                        "type": AvailabilityEnum.full.name
                    }
                ], person.id);


                $httpBackend.expect('PUT', '/api/slots/' + weekEndString + '/' + weekEndString + '?personId=' + person.id, expectedSlots).respond(200);

                $scope.changeSlotTypeCycleThrough(person.slotsList[2], testSlotId, weekEnd, person);
                tdprRecruiterSlotsService.updateSlots(tdprRecruiterSlotsService.filterSlots(person.slotsList, weekEnd), person.id, weekEnd, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        })
    })
});
