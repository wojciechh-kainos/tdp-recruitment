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
            it('should call backend with date from current week', function () {
                $httpBackend.expectGET('api/person/all?startDate=' + weekStart + '&endDate=' + weekEnd).respond(200);

                service.fetchPersons().then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });

            it('should set service persons field', function () {
                $httpBackend.expectGET('api/person/all?startDate=' + weekStart + '&endDate=' + weekEnd).respond(200, data);

                service.fetchPersons().then(function () {
                    expect(service.getPersons()).toEqual(data);
                });
                $httpBackend.flush();
            });
        })
    })
});
