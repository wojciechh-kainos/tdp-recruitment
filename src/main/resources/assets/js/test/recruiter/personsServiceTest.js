define(['angular', 'angularMocks', 'application/recruiter/services/tdprPersonsService', 'application/recruiter/services/tdprDateService'], function (angular) {
    describe('personsService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var service;
        var data = [2, 2];
        var weekStart;
        var weekEnd;

        beforeEach(inject(function (_tdprPersonsService_, _$httpBackend_, dateFilter) {
            $httpBackend = _$httpBackend_;
            service = _tdprPersonsService_;

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
                $httpBackend.expectGET('api/person/all?startDate=' + weekStart + '&endDate=' + weekEnd).respond(200, data);

                service.fetchPersonsWithSlotsForDates(weekStart, weekEnd).then(function (response) {
                    expect(response).toEqual(data);
                });
                $httpBackend.flush();
            });

            it('should fail when response is not 200', function () {
                $httpBackend.expectGET('api/person/all?startDate=' + weekStart + '&endDate=' + weekEnd).respond(400);

                service.fetchPersonsWithSlotsForDates(weekStart, weekEnd).then(function (response) {
                    expect(response.status).toEqual(400);
                });
                $httpBackend.flush();
            })
        });

        describe('createPerson', function () {
            it('should return created person on success', function () {
                $httpBackend.expectPUT('/api/person/create/').respond(200, data);

                service.createPerson({}).then(function (response) {
                    expect(response.data).toEqual(data);
                });
                $httpBackend.flush();
            });

            it('should return error message on error', function () {
                $httpBackend.expectPUT('/api/person/create/').respond(400);

                service.createPerson({}).then(undefined, function (response) {
                    expect(response.message).toEqual("Interviewer adding failed.");
                });
                $httpBackend.flush();
            });
        });
    })
});
