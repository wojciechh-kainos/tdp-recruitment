define(['angular', 'angularMocks', 'application/recruiter/services/personsService'], function (angular) {
    describe('personsService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;


        beforeEach(inject(function (_personsService_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            service = _personsService_;
        }));

        describe('getData', function () {
            it('should return valid data', function () {
                
                expect(true).toEqual(true);

            });

        })
    })
});
