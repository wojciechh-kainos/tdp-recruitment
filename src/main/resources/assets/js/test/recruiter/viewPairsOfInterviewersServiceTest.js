define(['angular', 'angularMocks', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'], function (angular) {
    describe('tdprRecruiterViewPairsOfInterviewersService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;

        beforeEach(inject(function (_tdprRecruiterViewPairsOfInterviewersService_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            service = _tdprRecruiterViewPairsOfInterviewersService_;
        }));

        describe('createPathParams', function(){
            it('should return path params when getting at least one role, start day and end day', function(){
                var pathParams = service.createPathParams(["isDev"], new Date('2015-12-13'), new Date('2015-12-17'));
                var expectedPathParams = 'startDate=2015-12-13&endDate=2015-12-17&isDev=true';
                expect(pathParams).toEqual(expectedPathParams);
            });

            it('should return path params when getting at least two roles, start day and end day', function(){
                var pathParams = service.createPathParams(["isDev", "isOps"], new Date('2015-12-13'), new Date('2015-12-17'));
                var expectedPathParams = 'startDate=2015-12-13&endDate=2015-12-17&isDev=true&isOps=true';
                expect(pathParams).toEqual(expectedPathParams);
            });

            it("should return false when roles not set", function(){
                var pathParams = service.createPathParams(new Date('2015-12-13'), new Date('2015-12-17'));
                expect(pathParams).toEqual(false);
            });

            it("should return false when days are not set", function(){
                var pathParams = service.createPathParams(["isDev"]);
                expect(pathParams).toEqual(false);
            });
        });

        describe('getPairs', function(){
            it("should return false when any of function arguments not set", function(){
                var response = service.getPairs(["isDev"], new Date('2015-12-13'));
                expect(response).toEqual(false);
            })
        })
    })
});
