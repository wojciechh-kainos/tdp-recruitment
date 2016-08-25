define(['angular', 'angularMocks', 'application/recruiter/services/tdprRecruiterViewPairsOfInterviewersService'], function (angular) {
    describe('recruiterViewPairsOfInterviewersService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;

        beforeEach(inject(function (_tdprRecruiterViewPairsOfInterviewersService_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            service = _tdprRecruiterViewPairsOfInterviewersService_;
        }));

        describe('createPathParams', function () {
            it('should return path params when getting at least one role, start day, end day, start time and end time', function () {
                var pathParams = service.createPathParams(["isDev"], new Date('2015-12-13'), new Date('2015-12-17'), '10:00:00', '12:30:00');
                var expectedPathParams = 'startDate=2015-12-13&endDate=2015-12-17&startTime=10:00:00&endTime=12:30:00&isDev=true';
                expect(pathParams).toEqual(expectedPathParams);
            });

            it('should return path params when getting at least two roles, start day, end day, start time and end time', function () {
                var pathParams = service.createPathParams(["isDev", "isOps"], new Date('2015-12-13'), new Date('2015-12-17'), '10:00:00', '12:30:00');
                var expectedPathParams = 'startDate=2015-12-13&endDate=2015-12-17&startTime=10:00:00&endTime=12:30:00&isDev=true&isOps=true';
                expect(pathParams).toEqual(expectedPathParams);
            });

            it("should return false when roles not set", function () {
                var pathParams = service.createPathParams(null, new Date('2015-12-13'), new Date('2015-12-17'), '10:00:00', '12:30:00');
                expect(pathParams).toEqual(false);
            });

            it("should return false when days are not set", function () {
                var pathParams = service.createPathParams(["isDev"], null, null, '10:00:00', '12:30:00');
                expect(pathParams).toEqual(false);
            });

            it("should return false when times are not set", function () {
                var pathParams = service.createPathParams(["isDev"], new Date('2015-12-13'), new Date('2015-12-17'));
                expect(pathParams).toEqual(false);
            });
        });

        describe('getPairs', function () {
            it("should reject promise when any of function arguments not set", function () {
                service.getPairs(["isDev"], new Date('2015-12-13'), new Date('2015-12-17')).then(
                    function () {
                        done(new Error("Promise should be rejected"));
                    },
                    function () {
                        done();
                    })
            });
        })
    })
});

