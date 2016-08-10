define(['angular', 'angularMocks', 'application/recruiter/services/tdprPersonsService'], function (angular) {
    describe('personsService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;
        var data = [2, 2];

        beforeEach(inject(function (_tdprPersonsService_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            service = _tdprPersonsService_;
        }));

        describe('fetchPersons', function () {
            it('should call backend with date from current week', function () { //test should be updated later
                $httpBackend.expectGET('api/person/all?startDate=2016-08-01&endDate=2016-08-07').respond(200);

                service.fetchPersonsWithSlotsForDates(new Date("2016-08-01"), new Date("2016-08-07")).then(function (response) {
                expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
            it('should set service persons field', function () {
                $httpBackend.expectGET('api/person/all?startDate=2016-08-01&endDate=2016-08-07').respond(200, data);

                service.fetchPersonsWithSlotsForDates(new Date("2016-08-01"), new Date("2016-08-07")).then(function () {
                    expect(service.getPersons()).toEqual(data);
                });
                $httpBackend.flush();
            })

        })
    })
});
