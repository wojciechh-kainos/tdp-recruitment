define(['angular', 'angularMocks', 'application/report/services/tdprReportService'], function (angular) {

    describe('tdprReportService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $httpBackend;
        var $service;
        var responseData = {
            person : 'person',
            numberOfAvailableSlots : 5
        };


        beforeEach(function () {
            module(function ($provide) {
                $provide.value('DateFormat', 'dd-MM-yyyy');
            });
        });

        beforeEach(inject(function (_tdprReportService_, _$httpBackend_) {
            $service = _tdprReportService_;
            $httpBackend = _$httpBackend_;
        }));

        describe('When response code 200', function(){
            it('should return data', function(){
                $httpBackend.expectGET('/api/report/13-01-2016/20-01-2016/1').respond(200, responseData);
                $service.getReport('13-01-2016', '20-01-2016', 1).then(function(response){
                    expect(response).toEqual(responseData);
                });
                $httpBackend.flush();
            });
        })
    })
});
