define(['angular', 'angularMocks', 'application/report/controllers/tdprReportDetailsController'], function (angular) {

    describe('tdprReportService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var reportService;
        var dateService;
        var $state;
        var $scope;
        var Notification;
        var NotificationDelay;
        var deferredPromise;

        beforeEach(inject(function (_$rootScope_, _$state_, $controller, _$q_) {
            reportService = jasmine.createSpyObj('tdprReportService', ['getReports']);

            dateService = jasmine.createSpyObj('tdprReportDateService', ['getLastWeekStartDate', 'getLastWeekEndDate', 'getLastMonthStartDate', 'getLastMonthEndDate']);
            $scope = _$rootScope_.$new();
            $state = _$state_;
            Notification = jasmine.createSpy('Notification', ['success', 'error']);
            NotificationDelay = jasmine.createSpyObj('NotificationDelay');
            deferredPromise = _$q_.defer();
            reportService.getReports.and.returnValue(deferredPromise.promise);
            $controller('tdprReportDetailsController', {
                $scope : $scope,
                $state : $state,
                tdprReportService : reportService,
                tdprReportDateService : dateService,
                DateFormat: 'dd-MM-yyyy',
                Notification : Notification,
                NotificationDelay: NotificationDelay
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
        });

        describe('Notification', function(){
            it('should return success when get data from server', function(){
                deferredPromise.resolve();
                $scope.$apply();

                expect(reportService.getReports).toHaveBeenCalledTimes(1);
                expect(Notification.success).toHaveBeenCalledWith({message : 'Report successfully downloaded.', delay : NotificationDelay});
            });

            it('should return error message when server does not return data', function(){
                deferredPromise.reject("Unable to get data from server!");
                $scope.$apply();

                expect(Notification.error).toHaveBeenCalledWith({message : "Unable to get data from server!", delay : NotificationDelay});
            });
        })
    })
});
