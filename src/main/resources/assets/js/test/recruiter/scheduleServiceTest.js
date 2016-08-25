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
            person = {id: 42, slotList: []};
            slot = {
                "day": '1410-07-15',
                "person": 42,
                "number": 7,
                "type": AvailabilityEnum.available.name,
                "changed": true
            };

            module(function ($provide) {
                $provide.value('AvailabilityEnum', AvailabilityEnum);
            });

            module(function ($provide) {
                $provide.value('DateFormat', 'yyyy-MM-dd');
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
                expect(person.changesPending).toEqual(true);
            });

            it('should create new slot if it does not exists', function () {
                tdprScheduleService.changeSlotType(undefined, slot.number, day, person, AvailabilityEnum.available.name);

                expect(person.slotList.length).toEqual(1);
                expect(person.slotList[0]).toEqual(slot);
                expect(person.changesPending).toEqual(true);
            });
        });

        describe('changeSlotTypeCycleThrough', function() {
            it('should call changeSlotType with availability type full if slot is undefined', function() {
                spyOn(tdprScheduleService, 'changeSlotType');

                tdprScheduleService.changeSlotTypeCycleThrough(undefined, slot.number, day, person, jasmine.any(Boolean));

                expect(tdprScheduleService.changeSlotType).toHaveBeenCalledWith(undefined, slot.number, '1410-07-15', person, AvailabilityEnum.full.name, jasmine.any(Boolean));
            });

            it('should call changeSlotType with availability type full if slot is available', function() {
                spyOn(tdprScheduleService, 'changeSlotType');
                slot.type = AvailabilityEnum.available.name;

                tdprScheduleService.changeSlotTypeCycleThrough(slot, slot.number, day, person, jasmine.any(Boolean));

                expect(tdprScheduleService.changeSlotType).toHaveBeenCalledWith(slot, slot.number, '1410-07-15', person, AvailabilityEnum.full.name, jasmine.any(Boolean));
            });

            it('should call changeSlotType with availability type full if slot is maybe', function() {
                spyOn(tdprScheduleService, 'changeSlotType');
                slot.type = AvailabilityEnum.maybe.name;

                tdprScheduleService.changeSlotTypeCycleThrough(slot, slot.number, day, person, jasmine.any(Boolean));

                expect(tdprScheduleService.changeSlotType).toHaveBeenCalledWith(slot, slot.number, '1410-07-15', person, AvailabilityEnum.full.name, jasmine.any(Boolean));
            });

            it('should call changeSlotType with availability type full if slot is init', function() {
                spyOn(tdprScheduleService, 'changeSlotType');
                slot.type = AvailabilityEnum.init.name;

                tdprScheduleService.changeSlotTypeCycleThrough(slot, slot.number, day, person, jasmine.any(Boolean));

                expect(tdprScheduleService.changeSlotType).toHaveBeenCalledWith(slot, slot.number, '1410-07-15', person, AvailabilityEnum.full.name, jasmine.any(Boolean));
            });

            it('should call changeSlotType with availability type init if slot is full', function() {
                spyOn(tdprScheduleService, 'changeSlotType');
                slot.type = AvailabilityEnum.full.name;

                tdprScheduleService.changeSlotTypeCycleThrough(slot, slot.number, day, person, jasmine.any(Boolean));

                expect(tdprScheduleService.changeSlotType).toHaveBeenCalledWith(slot, slot.number, '1410-07-15', person, AvailabilityEnum.init.name, jasmine.any(Boolean));
            });

            it('should not call changeSlotType with different availability type', function() {
                spyOn(tdprScheduleService, 'changeSlotType');
                slot.type = "fake availability name";

                tdprScheduleService.changeSlotTypeCycleThrough(slot, slot.number, day, person, jasmine.any(Boolean));

                expect(tdprScheduleService.changeSlotType).not.toHaveBeenCalled();
            });
        });

    })
});
