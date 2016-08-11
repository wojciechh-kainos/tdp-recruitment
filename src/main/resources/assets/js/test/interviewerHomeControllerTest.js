define(['angular', 'angularMocks', 'application/interviewer/controllers/tdprInterviewerHomeController', 'application/interviewer/services/tdprSlotsService', 'application/interviewer/services/tdprPersonService'], function (angular) {

    describe('tdprInterviewerHomeController', function () {
        beforeEach(angular.mock.module('tdprInterviewerModule'));

        var $scope;
        var $filter;
        var personId;
        var slotsService;
        var getSlotsDeferred;
        var AvailabilityEnum;

        beforeEach(inject(function ($controller, tdprSlotsService,tdprPersonService, _$rootScope_, _$filter_, $q) {
            personId = 42;
            $filter = _$filter_;
            $scope = _$rootScope_.$new();
            $scope.noteContent = {};
            slotsService = tdprSlotsService;
            personService = tdprPersonService;
            getNoteDeferred = $q.defer();
            updateNoteDeferred = $q.defer();
            getSlotsDeferred = $q.defer();
            var slotsTimesDeferred = $q.defer();
            var updateSlotsDeferred = $q.defer();
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
                    tooltipText: "maybe"
                }};

            spyOn(slotsService, 'getSlotsTimes').and.returnValue(slotsTimesDeferred.promise);
            spyOn(slotsService, 'getSlots').and.returnValue(getSlotsDeferred.promise);
            spyOn(slotsService, 'updateSlots').and.returnValue(updateSlotsDeferred.promise);
            spyOn(personService, 'getNote').and.returnValue(getNoteDeferred.promise);
            spyOn(personService, 'updateNote').and.returnValue(updateNoteDeferred.promise);

            $controller('tdprInterviewerHomeController', {
                $scope: $scope,
                tdprSlotsService: slotsService,
                tdprPersonService: personService,
                AvailabilityEnum: AvailabilityEnum,
                $stateParams: {id: personId}
            });

            slotsTimesDeferred.resolve({data: []});
            updateSlotsDeferred.resolve({data: []});
        }));

        it('should call getSlotsTimes at init', function () {
            expect(slotsService.getSlotsTimes).toHaveBeenCalled();
        });

        it('should call getSlots at init', function () {
            expect(slotsService.getSlots).toHaveBeenCalled();
        });

        it('should set currentType to available at init', function () {
            expect($scope.currentType).toEqual(AvailabilityEnum.available.id);
        });

        describe('getSlots', function () {
            it('should call service with correct dates and personId', function () {
                var startDate = $filter('date')(getDayOfTheWeek(new Date(), 0), "dd-MM-yyyy");
                var endDate = $filter('date')(getDayOfTheWeek(new Date(), 4), "dd-MM-yyyy");

                $scope.getSlots();
                $scope.$apply();

                expect(slotsService.getSlots).toHaveBeenCalledWith(startDate, endDate, personId);
            });

            it('should store values received from service in slotsForWeek array', function () {
                getSlotsDeferred.resolve({
                    data: [{number: 1, type: "available", day: getDayOfTheWeek(new Date(), 1)}, // 1st slot, tuesday
                        {number: 4, type: "unavailable", day: getDayOfTheWeek(new Date(), 4)}, // 4th slot, friday
                        {number: 6, type: "maybe", day: getDayOfTheWeek(new Date(), 0)}] // 6th slot, monday
                });

                $scope.getSlots();
                $scope.$apply();
                $scope.getSlots();

                expect($scope.slotsForWeek[0][0]).toEqual({type: AvailabilityEnum.empty.id});
                expect($scope.slotsForWeek[0][1]).toEqual({type: AvailabilityEnum.available.id});
                expect($scope.slotsForWeek[3][4]).toEqual({type: AvailabilityEnum.unavailable.id});
                expect($scope.slotsForWeek[5][0]).toEqual({type: AvailabilityEnum.maybe.id});
            });
        });

        describe('updateSlots', function () {
            it('should parse slots from table to proper json format', function () {
                $scope.slotsForWeek[0][0] = {type: {id: 42}};
                getSlotsDeferred.resolve({});

                var startDate = $filter('date')(getDayOfTheWeek(new Date(), 0), "dd-MM-yyyy");
                var endDate = $filter('date')(getDayOfTheWeek(new Date(), 5), "dd-MM-yyyy");

                $scope.updateSlots();
                $scope.$apply();

                expect(slotsService.updateSlots).toHaveBeenCalledWith([{
                    slotsDate: jasmine.any(Date),
                    person: {id: personId},
                    slot: {id: 1},
                    type: {id: {id: 42}}
                }], personId, startDate, endDate);
            });
        });

        describe('clearTable', function () {
            it('should set type of all objects in table to 0', function () {
                $scope.slotsForWeek[4][2] = {type: {id: 42}};
                $scope.slotsForWeek[2][4] = {type: {id: 42}};

                $scope.clearTable();
                $scope.$apply();

                $scope.slotsForWeek.forEach(function (days) {
                    days.forEach(function (slot) {
                        expect(slot).toEqual({type: AvailabilityEnum.empty.id});
                    });
                });
            });
        });

        describe('showPreviousWeek', function () {
            it('should decrease relativeDayNumber by 7', function () {
                $scope.showPreviousWeek();
                $scope.$apply();

                expect($scope.relativeDayNumber).toEqual(-7);
            });

            it('should clear table', function () {
                spyOn($scope, 'clearTable').and.callThrough();

                $scope.showPreviousWeek();
                $scope.$apply();

                expect($scope.clearTable).toHaveBeenCalled();
            });

            it('should get slots for new week', function () {
                spyOn($scope, 'getSlots').and.callThrough();

                $scope.showPreviousWeek();
                $scope.$apply();

                expect($scope.getSlots).toHaveBeenCalled();
            });
        });

        describe('showNextWeek', function () {
            it('should increase relativeDayNumber by 7', function () {
                $scope.showNextWeek();
                $scope.$apply();

                expect($scope.relativeDayNumber).toEqual(7);
            });

            it('should clear table', function () {
                spyOn($scope, 'clearTable').and.callThrough();

                $scope.showNextWeek();
                $scope.$apply();

                expect($scope.clearTable).toHaveBeenCalled();
            });

            it('should get slots for new week', function () {
                spyOn($scope, 'getSlots').and.callThrough();

                $scope.showNextWeek();
                $scope.$apply();

                expect($scope.getSlots).toHaveBeenCalled();
            });
        });
    });

    // copied from tdprInterviewHomeController
    function getDayOfTheWeek(d, i) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff + i)); // i = 0 - monday
    }
});
