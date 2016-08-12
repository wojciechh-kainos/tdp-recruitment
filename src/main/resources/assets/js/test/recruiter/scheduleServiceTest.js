define(['angular', 'angularMocks',
    'lodash',
    'application/recruiter/services/tdprScheduleService',
    'application/recruiter/services/tdprDateService',
    'application/recruiter/services/tdprRecruiterSlotsService'], function (angular) {
    describe('scheduleServiceTest', function () {
        'use strict';

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
            });
        });

        var $httpBackend;
        var tdprDateService;
        var tdprScheduleService;
        var tdprRecruiterSlotsService;
        var AvailabilityEnum;
        var dateFilter;

        beforeEach(inject(function (_$httpBackend_, _dateFilter_, _tdprDateService_, _tdprScheduleService_, _tdprRecruiterSlotsService_, _AvailabilityEnum_) {
            $httpBackend = _$httpBackend_;
            tdprDateService = _tdprScheduleService_;
            tdprScheduleService = _tdprScheduleService_;
            tdprRecruiterSlotsService = _tdprRecruiterSlotsService_;
            dateFilter = _dateFilter_;
            AvailabilityEnum = _AvailabilityEnum_;
        }));

        var weekStart;
        var weekStartString;
        var weekEnd;
        var weekEndString;
        var person;

        var testSlotId;
        var testDay;

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

            testSlotId = 8;
            testDay = weekStart;
        });

        describe('changeSlotTypeCycleThrough', function () {
            it('should create put request with new added available slot at number 8', function () {
                // Simulate person slots for current day
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
                        "type": AvailabilityEnum.available.name
                    }
                ], person.id);


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekEndString, expectedSlots).respond(200);


                tdprScheduleService.changeSlotTypeCycleThrough(testSlotId, testDay, person);
                tdprRecruiterSlotsService.prepareAndUpdateSlots(person.slotsList, person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });


            it('should create put request with changed slot at number 8 from available to full', function () {
                // Simulate person slots for current day
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


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekEndString, expectedSlots).respond(200);

                tdprScheduleService.changeSlotTypeCycleThrough(testSlotId, testDay, person);
                tdprRecruiterSlotsService.prepareAndUpdateSlots(person.slotsList, person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

            it('should create put request with removed slot at number 8', function () {
                // Simulate person slots for current day
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
                        "type": AvailabilityEnum.maybe.name
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
                    }
                ], person.id);

                console.log(expectedSlots);


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekEndString, expectedSlots).respond(200);

                tdprScheduleService.changeSlotTypeCycleThrough(testSlotId, weekStart, person);
                tdprRecruiterSlotsService.prepareAndUpdateSlots(person.slotsList, person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        });

        describe('changeSlotTypeCycleThrough - filtering, response statuses', function () {

            it('should create put request with change slot number 8 from full to init state and filter for only one day', function () {
                // Simulate person slots for current day
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

                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekEndString, expectedSlots).respond(200);

                tdprScheduleService.changeSlotTypeCycleThrough(testSlotId, weekStart, person);
                tdprRecruiterSlotsService.prepareAndUpdateSlots(tdprRecruiterSlotsService.filterSlots(person.slotsList, weekStart), person.id, weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

            it('should create put request which resolves with "NOT_ACCEPTABLE" 406 error - changing slots from past', function () {
                // Simulate person slots for current day
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


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekStartString, expectedSlots).respond(406);

                tdprScheduleService.changeSlotTypeCycleThrough(testSlotId, weekStart, person);
                tdprRecruiterSlotsService.prepareAndUpdateSlots(tdprRecruiterSlotsService.filterSlots(person.slotsList, weekStart), person.id, weekStart, weekStartString).then(function (response) {
                    expect(response.status).toEqual(406);
                });

                $httpBackend.flush();
            });


            it('should create put request which resolves with 200 status - changing slots in future', function () {
                // Simulate person slots for current day
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


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekEndString + '/' + weekEndString, expectedSlots).respond(200);

                tdprScheduleService.changeSlotTypeCycleThrough(testSlotId, weekEnd, person);
                tdprRecruiterSlotsService.prepareAndUpdateSlots(tdprRecruiterSlotsService.filterSlots(person.slotsList, weekEnd), person.id, weekEnd, weekEnd).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        })
    })
});
