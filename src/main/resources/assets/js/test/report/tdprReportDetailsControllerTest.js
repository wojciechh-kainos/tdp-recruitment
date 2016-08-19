define(['angular', 'angularMocks', 'application/report/services/tdprReportService', 'application/report/controllers/tdprReportDetailsController'], function (angular) {

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
            dateService = jasmine.createSpyObj('tdprReportDateService', ['getLastWeekStartDate', 'getLastWeekEndDate', 'getLastMonthStartDate', 'getLastMonthEndDate']);
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $httpBackend = _$httpBackend_;
            getReportsDeferred = $q.defer();
            $controller('tdprReportDetailsController', {
                $scope : $scope,
                $state : $state,
                tdprReportService : reportService,
                tdprReportDateService : dateService
            });
        }));

        describe('Function activate', function(){
            it('function from dateService should be triggered when state params empty', function(){
                $state.params.dateStart = '';
                $state.params.dateEnd = '';
                $scope.activate();
                expect(dateService.getLastWeekStartDate).toHaveBeenCalled();
                expect(dateService.getLastWeekEndDate).toHaveBeenCalled();
            });

            it('function from dateService should be triggered when state params empty, $scope values of start and end date should be equal $state values', function(){
                $state.params.dateStart = '2016-08-08';
                $state.params.dateEnd = '2016-08-14';
                $scope.activate();
                expect(dateService.getLastWeekStartDate).not.toHaveBeenCalled();
                expect(dateService.getLastWeekEndDate).not.toHaveBeenCalled();
                expect($scope.startDate).toEqual(new Date($state.params.dateStart));
                expect($scope.endDate).toEqual(new Date($state.params.dateEnd));
            });


        })
    })
});
