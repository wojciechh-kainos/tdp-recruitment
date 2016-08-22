define(['angular', 'angularMocks', 'application/report/services/tdprReportService'], function (angular) {

    describe('tdprReportService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $httpBackend;
        var $service;
        var responseReports = [
            {
                person : 'person',
                initHours : 5,
                fullHours : 2
            }
        ];

        var expectedReports = [
            {
                person : 'person',
                initHours : 5,
                fullHours : 2,
                sumOfHours : 7
            }
        ];

        beforeEach(inject(function (_tdprReportService_, _$httpBackend_) {
            $service = _tdprReportService_;
            $httpBackend = _$httpBackend_;
        }));

        describe('When response code 200', function(){
            it('should return reports with sum of fulls and inits added', function(){
                $httpBackend.expectGET('/api/report/13-01-2016/20-01-2016').respond(200, responseReports);
                $service.getReports('13-01-2016', '20-01-2016', 1).then(function(response){
                    expect(response).toEqual(expectedReports);
                });
                $httpBackend.flush();
            });
        })

    })
});
