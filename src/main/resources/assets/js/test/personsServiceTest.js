define(['angular', 'angularMocks', 'application/recruiter/services/personsService'], function (angular) {
    describe('personsService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;
        var data = [2, 2];

        beforeEach(inject(function (_personsService_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            service = _personsService_;
        }));

        describe('fetchPersons', function () {
            it('should call backend with date from current week', function () { //test should be updated later
                $httpBackend.expectGET('api/person/all?startDate=2016-08-01&endDate=2016-08-07').respond(200);

                service.fetchPersons().then(function (response) {
                expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
            it('should set service persons field', function () {
                $httpBackend.expectGET('api/person/all?startDate=2016-08-01&endDate=2016-08-07').respond(200, data);

                service.fetchPersons().then(function () {
                    expect(service.getPersons()).toEqual(data);
                });
                $httpBackend.flush();
            })

        })
    })
});
