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
            it('should return path params when getting at least personId, one role and day', function(){
                var pathParams = service.createPathParams(1,["isDev"], '2015-12-13');
                var expectedPathParams = 'personId=1&isDev=true&date=2015-12-13';
                expect(pathParams).toEqual(expectedPathParams);
            });

            it('should return path params when getting at least personId, one role and day', function(){
                var pathParams = service.createPathParams(1,["isDev", "isOps"], '2015-12-13');
                var expectedPathParams = 'personId=1&isDev=true&isOps=true&date=2015-12-13';
                expect(pathParams).toEqual(expectedPathParams);
            });

            it('should return false when personId not set', function(){
                var pathParams = service.createPathParams(["isDev"], '2015-12-13');
                expect(pathParams).toEqual(false);
            });

            it("should return false when roles not set", function(){
                var pathParams = service.createPathParams(1, '2015-12-13');
                expect(pathParams).toEqual(false);
            });

            it("should return false when day not set", function(){
                var pathParams = service.createPathParams(1, ["isDev"]);
                expect(pathParams).toEqual(false);
            });
        });

        describe('getPairs', function(){
            it("should return false when any of function arguments not set", function(){
                var response = service.getPairs(["isDev"], '2015-12-13');
                expect(response).toEqual(false);
            })
        })
    })
});
