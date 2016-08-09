define(['angular', 'angularMocks',
    'lodash',
    'application/recruiter/services/tdprScheduleService',
    'application/recruiter/services/tdprDateService',
    'application/recruiter/services/tdprRecruiterSlotsService'], function (angular) {
    describe('scheduleFeatureTest', function () {
        'use strict';

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(function () {
            module('tdprRecruiterModule', function ($provide) {
                $provide.constant('AvailabilityEnum', {
                    empty: {
                        id: 0,
                        name: "empty",
                        className: "cell-avail-empty",
                        tooltipText: ""
                    },
                    available: {
                        id: 1,
                        name: "available",
                        className: "cell-avail-available",
                        tooltipText: "available "
                    },
                    full: {
                        id: 2,
                        name: "full",
                        className: "cell-avail-full",
                        tooltipText: "full "
                    },
                    init: {
                        id: 3,
                        name: "init",
                        className: "cell-avail-init",
                        tooltipText: "init call"
                    },
                    unavailable: {
                        id: 4,
                        name: "unavailable",
                        className: "cell-avail-unavailable",
                        tooltipText: ""
                    },
                    maybe: {
                        id: 5,
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
        var weekEnd;
        var weekStartString;

        var person;

        beforeEach(function () {
            var format = 'yyyy-MM-dd';
            var now = new Date();
            weekStart = new Date();
            weekEnd = new Date();
            weekStart.setDate(now.getDate() - now.getDay() + 1);
            weekEnd.setDate(now.getDate() + (7 - now.getDay()));

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

            weekStart = dateFilter(weekStart, format);
            weekStartString = dateFilter(weekStart, 'dd-MM-yyyy');
        });

        describe('changeSlotType', function () {
            it('should request put with new added available slot at 8', function () {
                var startSlots = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 9,
                        "type": AvailabilityEnum.full.name
                    }
                ];

                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 8,
                        "type": AvailabilityEnum.available.name
                    }
                ], weekStart, person.id);


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekStartString, expectedSlots).respond(200);

                // Simulate click on object
                var objectArray = {
                    slotId: 8,
                    day: weekStart
                };

                tdprScheduleService.changeSlotTypeCycleThrough(objectArray, startSlots, person).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });


            it('should request put with changed available slot at 8 to full', function () {
                var startSlots = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 8,
                        "type": AvailabilityEnum.available.name
                    }
                ];

                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 8,
                        "type": AvailabilityEnum.full.name
                    }
                ], weekStart, person.id);


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekStartString, expectedSlots).respond(200);

                // Simulate click on object
                var objectArray = {
                    slotId: 8,
                    day: weekStart,
                    type: AvailabilityEnum.available.name
                };

                tdprScheduleService.changeSlotTypeCycleThrough(objectArray, startSlots, person).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

            it('should clear type slot at 8', function () {
                var startSlots = [
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 9,
                        "type": AvailabilityEnum.full.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 8,
                        "type": AvailabilityEnum.maybe.name
                    }
                ];

                var expectedSlots = tdprRecruiterSlotsService.reformatSlots([
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 7,
                        "type": AvailabilityEnum.available.name
                    },
                    {
                        "day": weekStart,
                        "person": 9,
                        "slot": 9,
                        "type": AvailabilityEnum.full.name
                    }
                ], weekStart, person.id);


                $httpBackend.expect('PUT', '/api/slots/update/' + person.id + '/' + weekStartString + '/' + weekStartString, expectedSlots).respond(200);

                // Simulate click on object
                var objectArray = {
                    slotId: 8,
                    day: weekStart,
                    type: AvailabilityEnum.maybe.name
                };

                tdprScheduleService.changeSlotTypeCycleThrough(objectArray, startSlots, person).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

        })
    })
});
