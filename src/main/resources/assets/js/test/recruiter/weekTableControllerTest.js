define(['angular', 'angularMocks', 'application/recruiter/controllers/tdprWeekTableController'], function (angular) {
    describe('weekTableController', function () {
        'use strict';

        var $q;
        var person;
        var persons;
        var $scope;
        var Notification;
        var tdprDateService;
        var tdprWeekTableController;
        var tdprRecruiterSlotsService;
        var tdprScheduleService;
        var tdprPersonsService;
        var tdprAuthService;

        var updateSlotsDeferred;
        var fetchPersonsDeferred;
        var WeekNavigateEnum = {
            previous: -1,
            next: 1,
            current: 0
        };

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_) {
                var AvailabilityEnum = {
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
                    }
                };

                var slotsTimes = [{"id": 1, "startTime": "08:00:00", "endTime": "08:30:00"},
                    {"id": 2, "startTime": "08:30:00", "endTime": "09:00:00"},
                    {"id": 3, "startTime": "09:00:00", "endTime": "09:30:00"},
                    {"id": 4, "startTime": "09:30:00", "endTime": "10:00:00"}];

                person = {
                    "changesPending": true,
                    "slotList": [
                        {
                            "day": '1410-07-15',
                            "person": 9,
                            "number": 7,
                            "type": AvailabilityEnum.available.name
                        },
                        {
                            "day": '1410-07-15',
                            "person": 9,
                            "number": 9,
                            "type": AvailabilityEnum.full.name
                        }
                    ]
                };

                persons = [person];

                $scope = _$rootScope_.$new();

                $q = _$q_;
                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);
                tdprDateService = jasmine.createSpyObj('tdprDateService', ['getWeekWithOffset']);
                tdprPersonsService = jasmine.createSpyObj('tdprPersonsService', ['fetchPersonsWithSlotsForDates']);
                tdprRecruiterSlotsService = jasmine.createSpyObj('tdprRecruiterSlotsService', ['updateSlots']);
                tdprScheduleService = jasmine.createSpyObj('tdprScheduleService', ['tripleSlotChange', 'changeSlotTypeCycleThrough', 'changeSlotDiscardChanges']);
                tdprAuthService = jasmine.createSpyObj('tdprAuthService', ['getCurrentUser']);

                updateSlotsDeferred = $q.defer();
                fetchPersonsDeferred = $q.defer();
                tdprDateService.getWeekWithOffset.and.returnValue([{}, {}, {}, {}, {}]); // five empty objects representing days
                tdprRecruiterSlotsService.updateSlots.and.returnValue(updateSlotsDeferred.promise);
                tdprPersonsService.fetchPersonsWithSlotsForDates.and.returnValue(fetchPersonsDeferred.promise);

                tdprWeekTableController = $controller('tdprWeekTableController', {
                    $scope: $scope,
                    tdprPersonsService: tdprPersonsService,
                    tdprDateService: tdprDateService,
                    persons: persons,
                    slotsTimes: slotsTimes,
                    Notification: Notification,
                    tdprRecruiterSlotsService: tdprRecruiterSlotsService,
                    AvailabilityEnum: AvailabilityEnum,
                    WeekNavigateEnum: WeekNavigateEnum,
                    tdprScheduleService: tdprScheduleService,
                    tdprAuthService: tdprAuthService
                });
            })
        );

        describe('changeSlotTypeCycleThrough', function () {
            it('should call tdprScheduleService with correct data if not in pairing mode', function () {
                var slotId = 42;
                $scope.changeSlotTypeCycleThrough(person.slotList, slotId, jasmine.any(Date), person);

                expect(tdprScheduleService.changeSlotTypeCycleThrough).toHaveBeenCalledWith(person.slotList, slotId, jasmine.any(Date), person);
            });
        });

        describe('changeSlotDiscardChanges', function () {
            it('should call tdprScheduleService with correct data', function () {
                $scope.changeSlotDiscardChanges(person);

                expect(tdprScheduleService.changeSlotDiscardChanges).toHaveBeenCalledWith(person);
            });
        });

        describe('changeWeek', function () {
            it('should call dateService with correct offset', function () {
                $scope.offset = WeekNavigateEnum.current;
                $scope.changeWeek(WeekNavigateEnum.next);
                $scope.changeWeek(WeekNavigateEnum.next);
                $scope.changeWeek(WeekNavigateEnum.next);

                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(1);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(2);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(3);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledTimes(4);
                expect(tdprPersonsService.fetchPersonsWithSlotsForDates).toHaveBeenCalledTimes(3);
            });

            it('should call dateService with correct offset', function () {
                $scope.offset = WeekNavigateEnum.current;
                $scope.changeWeek(WeekNavigateEnum.previous);
                $scope.changeWeek(WeekNavigateEnum.previous);
                $scope.changeWeek(WeekNavigateEnum.previous);

                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(-1);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(-2);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(-3);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledTimes(4);
                expect(tdprPersonsService.fetchPersonsWithSlotsForDates).toHaveBeenCalledTimes(3);
            });
        });

        describe('changeSlotSubmitChanges', function () {
            it('should show notification on success', function () {
                updateSlotsDeferred.resolve();

                $scope.changeSlotSubmitChanges(person);
                $scope.$apply();

                expect(tdprRecruiterSlotsService.updateSlots).toHaveBeenCalledWith(person.slotList);
                expect(person.changesPending).toEqual(false);
                expect(Notification.success).toHaveBeenCalledWith('Your changes were saved successfully!');
            });

            it('should show notification on error', function () {
                var expectedMessage = "some dummy error message";
                updateSlotsDeferred.reject({"message": expectedMessage});

                $scope.changeSlotSubmitChanges(person);
                $scope.$apply();

                expect(tdprRecruiterSlotsService.updateSlots).toHaveBeenCalledWith(person.slotList);
                expect(Notification.error).toHaveBeenCalledWith(expectedMessage);
            });
        });
    })
});
