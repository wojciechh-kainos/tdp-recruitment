define(['angular', 'angularMocks', 'application/interviewer/controllers/tdprInterviewerHomeController', 'application/interviewer/services/tdprSlotsService'], function (angular) {

    describe('tdprInterviewerHomeController', function () {
        beforeEach(angular.mock.module('tdprInterviewerModule'));

        var $scope;
        var $filter;
        var personId;
        var slotsService;
        var getSlotsDeferred;

        beforeEach(inject(function ($controller, tdprSlotsService, _$rootScope_, _$filter_, $q) {
            personId = 42;
            $filter = _$filter_;
            $scope = _$rootScope_.$new();
            slotsService = tdprSlotsService;
            getSlotsDeferred = $q.defer();
            var slotsTimesDeferred = $q.defer();
            var updateSlotsDeferred = $q.defer();

            spyOn(slotsService, 'getSlotsTimes').and.returnValue(slotsTimesDeferred.promise);
            spyOn(slotsService, 'getSlots').and.returnValue(getSlotsDeferred.promise);
            spyOn(slotsService, 'updateSlots').and.returnValue(updateSlotsDeferred.promise);

            $controller('tdprInterviewerHomeController', { $scope: $scope, tdprSlotsService: slotsService, $stateParams: {id: personId} });

            slotsTimesDeferred.resolve({data: []});
            updateSlotsDeferred.resolve({data: []});
        }));

        it('should call getSlotsTimes at init', function () {
            expect(slotsService.getSlotsTimes).toHaveBeenCalled();
        });

        it('should call getSlots at init', function () {
            expect(slotsService.getSlots).toHaveBeenCalled();
        });

        it('should initialize currentType to 1', function () {
            expect($scope.currentType).toEqual('1');
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
                getSlotsDeferred.resolve({data: [{slot: {id: 1}, type: {id: 61}, slotsDate: getDayOfTheWeek(new Date(), 1)}, // 1st slot, tuesday
                    {slot: {id: 4}, type: {id: 62}, slotsDate: getDayOfTheWeek(new Date(), 4)}, // 4th slot, friday
                    {slot: {id: 6}, type: {id: 63}, slotsDate: getDayOfTheWeek(new Date(), 0)}]}); // 6th slot, monday

                $scope.getSlots();
                $scope.$apply();

                expect($scope.slotsForWeek[0][0]).toEqual({type: '0'});
                expect($scope.slotsForWeek[0][1]).toEqual({type: '61'});
                expect($scope.slotsForWeek[3][4]).toEqual({type: '62'});
                expect($scope.slotsForWeek[5][0]).toEqual({type: '63'});
            });
        });

        describe('updateSlots', function () {
            it('should parse slots from table to proper json format', function () {
                $scope.slotsForWeek[0][0] = {type: {id: 1}};
                getSlotsDeferred.resolve({});

                var startDate = $filter('date')(getDayOfTheWeek(new Date(), 0), "dd-MM-yyyy");
                var endDate = $filter('date')(getDayOfTheWeek(new Date(), 4), "dd-MM-yyyy");

                $scope.updateSlots();
                $scope.$apply();

                expect(slotsService.updateSlots).toHaveBeenCalledWith([{
                    slotsDate: jasmine.any(Date),
                    person: {id: personId},
                    slot: {id: 1},
                    type: {id: {id: 1}}
                }], personId, startDate, endDate);
            });
        });

        describe('clearTable', function () {
           it('should set type of all objects in table to 0', function () {
               $scope.slotsForWeek[4][2] = {type: {id: 4}};

               $scope.clearTable();
               $scope.$apply();

               $scope.slotsForWeek.forEach(function (days) {
                   days.forEach(function (slot) {
                      expect(slot).toEqual({type: '0'});
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
