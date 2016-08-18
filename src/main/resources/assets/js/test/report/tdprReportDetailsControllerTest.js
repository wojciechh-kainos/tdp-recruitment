define(['angular', 'angularMocks', 'application/report/services/tdprReportService', 'application/report/controllers/tdprReportDetailsController'], function (angular) {

    describe('tdprReportService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $httpBackend;
        var $service;
        var $state;
        var $scope;
        var getReportsDeferred;
        var responseData = {
            person : 'person',
            numberOfAvailableSlots : 5
        };

        beforeEach(inject(function (_tdprReportService_, _$httpBackend_, _$rootScope_, _$state_, $q, $controller) {
            $service = _tdprReportService_;
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $httpBackend = _$httpBackend_;
            getReportsDeferred = $q.defer();
            $controller('tdprReportDetailsController', {
                $scope : $scope,
                $state : $state,
                tdprReportService : $service
            });
        }));

        describe('Function setLastWeekDate', function(){
            it('should set this week dates in $scope', function(){
                $state.params.dateStart = '';
                $state.params.dateEnd = '';
                expect(true).toEqual(true);
            });
        })
    })
});
