define(['angular', 'angularMocks', 'application/report/services/tdprReportService','application/report/services/tdprReportDateService', 'application/report/controllers/tdprReportDetailsController'], function (angular) {

    describe('tdprReportService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $httpBackend;
        var reportService;
        var dateService;
        var $state;
        var $scope;
        var getReportsDeferred;
        var $controller;


        beforeEach(inject(function (_tdprReportService_, _$httpBackend_, _$rootScope_, _$state_, $q, $controller) {
            reportService = _tdprReportService_;
            dateService = jasmine.createSpyObj('tdprDateService', ['getLastWeekStartDate', 'getLastWeekEndDate', 'getLastMonthStartDate', 'getLastMonthEndDate'])
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $httpBackend = _$httpBackend_;
            getReportsDeferred = $q.defer();
            $controller('tdprReportDetailsController', {
                $scope : $scope,
                $state : $state,
                tdprReportService : reportService,
                tdprDateService : dateService
            });
        }));

        describe('Function setLastWeekDate', function(){
            it('should set this week dates in $scope', function(){
                $state.params.dateStart = '';
                $state.params.dateEnd = '';
                $scope.activate();
                expect(dateService.getLastWeekStartDate).toHaveBeenCalled();
            });
        })
    })
});
