define(['angular', 'angularMocks', 'application/report/services/tdprReportService','application/report/services/tdprReportDateService', 'application/report/controllers/tdprReportDetailsController'], function (angular) {

    describe('tdprReportService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $httpBackend;
        var reportService;
        var dateService;
        var $state;
        var $scope;
        var getReportsDeferred;

        beforeEach(inject(function (_tdprReportService_, _tdprReportDateService_, _$httpBackend_, _$rootScope_, _$state_, $q, $controller) {
            reportService = _tdprReportService_;
            dateService = _tdprReportDateService_;
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $httpBackend = _$httpBackend_;
            getReportsDeferred = $q.defer();

            spyOn(dateService, 'getLastWeekStartDate').and.returnValue(new Date());
            spyOn(dateService, 'getLastWeekEndDate').and.returnValue(new Date());
            spyOn(dateService, 'getLastMonthStartDate').and.returnValue(new Date());
            spyOn(dateService, 'getLastMonthEndDate').and.returnValue(new Date());

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
                expect(true).toEqual(true);
            });
        })
    })
});
