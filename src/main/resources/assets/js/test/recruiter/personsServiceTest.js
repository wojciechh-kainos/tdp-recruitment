define(['angular', 'angularMocks', 'application/recruiter/services/tdprPersonsService', 'application/recruiter/services/tdprDateService'], function (angular) {
    describe('personsService', function () {

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;
        var data = [2, 2];
        var weekStart;
        var weekEnd;
        var person;
        var HttpStatusCodes;

        beforeEach(function () {

            HttpStatusCodes = {
                ok : 200,
                badRequest: 400,
                conflict : 409
            };

            module(function ($provide) {
                $provide.value('HttpStatusCodes', HttpStatusCodes);
            });
        });

        beforeEach(inject(function (_tdprPersonsService_, _$httpBackend_, dateFilter) {

            $httpBackend = _$httpBackend_;
            service = _tdprPersonsService_;

            person = {"id": "2"};
            var format = 'yyyy-MM-dd';
            var now = new Date();
            weekStart = new Date();
            weekEnd = new Date();
            weekStart.setDate(now.getDate() - now.getDay() + 1);
            weekEnd.setDate(now.getDate() + (7 - now.getDay()));

            weekStart = dateFilter(weekStart, format);
            weekEnd = dateFilter(weekEnd, format);
        }));




        describe('fetchPersons', function () {
            it('should fetch valid data', function () {
                $httpBackend.expectGET('api/person/all?startDate=' + weekStart + '&endDate=' + weekEnd).respond(HttpStatusCodes.ok, data);

                service.fetchPersonsWithSlotsForDates(weekStart, weekEnd).then(function (response) {
                    expect(response).toEqual(data);
                });
                $httpBackend.flush();
            });

            it('should fail when response is not 200', function () {
                $httpBackend.expectGET('api/person/all?startDate=' + weekStart + '&endDate=' + weekEnd).respond(HttpStatusCodes.badRequest);

                service.fetchPersonsWithSlotsForDates(weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(HttpStatusCodes.badRequest);
                });
                $httpBackend.flush();
            })
        });

        describe('createPerson', function () {
            it('should return created person on success', function () {
                $httpBackend.expectPUT('/api/person/create/').respond(HttpStatusCodes.ok, data);

                service.createPerson({}).then(function (response) {
                    expect(response.data).toEqual(data);
                });
                $httpBackend.flush();
            });

            it('should return error message on error', function () {
                $httpBackend.expectPUT('/api/person/create/').respond(HttpStatusCodes.badRequest);

                service.createPerson({}).then(undefined, function (response) {
                    expect(response.message).toEqual("Interviewer adding failed.");
                });
                $httpBackend.flush();
            });
        });

        describe('managePerson', function () {
            it('should return updated person on success', function () {
                $httpBackend.expectPUT('/api/person/' + 2).respond(HttpStatusCodes.ok, data);

                service.managePerson(person).then(function (response) {
                    expect(response.data).toEqual(data);
                });
                $httpBackend.flush();
            });
        });
    })
});
