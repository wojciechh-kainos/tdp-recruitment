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

        var updateSlotsDeferred;
        var fetchPersonsDeferred;

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
                    "slotsList": [
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
                tdprDateService = jasmine.createSpyObj('tdprDateService', ['getCurrentWeek', 'getWeekWithOffset']);
                tdprPersonsService = jasmine.createSpyObj('tdprPersonsService', ['fetchPersonsWithSlotsForDates']);
                tdprRecruiterSlotsService = jasmine.createSpyObj('tdprRecruiterSlotsService', ['updateSlots']);
                tdprScheduleService = jasmine.createSpyObj('tdprScheduleService', ['changeSlotTypeCycleThrough', 'changeSlotDiscardChanges']);

                updateSlotsDeferred = $q.defer();
                fetchPersonsDeferred = $q.defer();
                tdprDateService.getCurrentWeek.and.returnValue([{}, {}, {}, {}, {}]); // five empty objects representing days
                tdprDateService.getWeekWithOffset.and.returnValue([{}, {}, {}, {}, {}]); // five empty objects representing days
                tdprRecruiterSlotsService.updateSlots.and.returnValue(updateSlotsDeferred.promise);
                tdprPersonsService.fetchPersonsWithSlotsForDates.and.returnValue(fetchPersonsDeferred.promise);

                tdprWeekTableController = $controller('tdprWeekTableController', {
                    $scope: $scope,
                    tdprPersonsService: tdprPersonsService,
                    tdprDateService: tdprDateService,
                    persons: persons,
                    slotsTimes: slotsTimes,
                    JobProfileEnum: {dev: "isDev"},
                    Notification: Notification,
                    tdprRecruiterSlotsService: tdprRecruiterSlotsService,
                    AvailabilityEnum: AvailabilityEnum,
                    tdprScheduleService: tdprScheduleService
                });
            })
        );

        describe('changeSlotTypeCycleThrough', function () {
            it('should call tdprScheduleService with correct data', function () {
                var slotId = 42;
                $scope.changeSlotTypeCycleThrough(person.slotsList, slotId, jasmine.any(Date), person);

                expect(tdprScheduleService.changeSlotTypeCycleThrough).toHaveBeenCalledWith(person.slotsList, slotId, jasmine.any(Date), person);
            });
        });

        describe('changeSlotDiscardChanges', function () {
            it('should call tdprScheduleService with correct data', function () {
                $scope.changeSlotDiscardChanges(person);

                expect(tdprScheduleService.changeSlotDiscardChanges).toHaveBeenCalledWith(person);
            });
        });

        describe('showNextWeek', function () {
            it('should call dateService with correct offset', function () {
                $scope.showNextWeek();
                $scope.showNextWeek();
                $scope.showNextWeek();

                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(1);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(2);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(3);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledTimes(3);
                expect(tdprPersonsService.fetchPersonsWithSlotsForDates).toHaveBeenCalledTimes(3);
            });
        });

        describe('showPreviousWeek', function () {
            it('should call dateService with correct offset', function () {
                $scope.showPreviousWeek();
                $scope.showPreviousWeek();
                $scope.showPreviousWeek();

                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(-1);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(-2);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledWith(-3);
                expect(tdprDateService.getWeekWithOffset).toHaveBeenCalledTimes(3);
                expect(tdprPersonsService.fetchPersonsWithSlotsForDates).toHaveBeenCalledTimes(3);
            });
        });

        describe('changeSlotSubmitChanges', function () {
            it('should show notification on success', function () {
                updateSlotsDeferred.resolve();

                $scope.changeSlotSubmitChanges(person);
                $scope.$apply();

                expect(tdprRecruiterSlotsService.updateSlots).toHaveBeenCalledWith(person.slotsList, person.id, jasmine.any(Object), jasmine.any(Date));
                expect(person.changesPending).toEqual(false);
                expect(Notification.success).toHaveBeenCalledWith({
                    message: 'Your changes were saved successfully!',
                    delay: 3500
                });
            });

            it('should show notification on error', function () {
                var expectedMessage = "some dummy error message";
                updateSlotsDeferred.reject({"message": expectedMessage});

                $scope.changeSlotSubmitChanges(person);
                $scope.$apply();

                expect(tdprRecruiterSlotsService.updateSlots).toHaveBeenCalledWith(person.slotsList, person.id, jasmine.any(Object), jasmine.any(Date));
                expect(Notification.error).toHaveBeenCalledWith({message: expectedMessage, delay: 3500});
            });
        });
    })
});
