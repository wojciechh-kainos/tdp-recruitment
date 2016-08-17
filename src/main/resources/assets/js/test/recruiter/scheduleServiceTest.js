define(['angular', 'angularMocks', 'application/recruiter/services/tdprScheduleService'], function (angular) {
    describe('scheduleServiceTest', function () {
        'use strict';

        var day;
        var slot;
        var person;
        var AvailabilityEnum;
        var tdprScheduleService;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(function () {
            AvailabilityEnum = {
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
            };

            day = new Date(1410, 6, 15);
            person = {id: 42, slotsList: []};
            slot = {
                "day": '1410-07-15',
                "person": 42,
                "number": 7,
                "type": AvailabilityEnum.available.name
            };

            module(function ($provide) {
                $provide.value('AvailabilityEnum', AvailabilityEnum);
            });

            inject(function ($injector) {
                tdprScheduleService = $injector.get('tdprScheduleService');
            });
        });

        describe('changeSlotType', function () {
            it('should change slot type if slot exists', function () {
                tdprScheduleService.changeSlotType(slot, slot.number, day, person, AvailabilityEnum.full.name);

                expect(slot.type).toEqual(AvailabilityEnum.full.name);
                expect(person.changesPending).toEqual(true);
            });

            it('should reset slot type if slot exists and changeTo is undefined', function () {
                tdprScheduleService.changeSlotType(slot, slot.number, day, person, undefined);

                expect(slot.type).toEqual("");
            });

            it('should create new slot if it does not exists', function () {
                tdprScheduleService.changeSlotType(undefined, slot.number, day, person, AvailabilityEnum.available.name);

                expect(person.slotsList.length).toEqual(1);
                expect(person.slotsList[0]).toEqual(slot);
                expect(person.changesPending).toEqual(true);
            });
        });

    })
});
