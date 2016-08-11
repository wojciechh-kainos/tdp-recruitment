define(['angular', 'angularMocks', 'application/interviewer/services/tdprPersonService'], function (angular) {
    describe('tdprPersonService', function () {
        beforeEach(angular.mock.module('tdprInterviewerModule'));

        var personId;
        var service;
        var $httpBackend;

        beforeEach(inject(function (_tdprPersonService_, _$httpBackend_) {
            personId = 42;
            $httpBackend = _$httpBackend_;
            service = _tdprPersonService_;
        }));

        describe('getPersonDetails', function () {
            it('should call backend with given person id', function () {
                $httpBackend.expectGET('/api/person/' + personId).respond(200, {id: personId});

                service.getPersonDetails(personId).then(function (response) {
                    expect(response).toEqual({id: personId});
                });

                $httpBackend.flush();
            });
        });

        describe('updatePersonDetails', function () {
            it('should call backend with given person object', function () {
                var person = {id: 100, email: 'a@a'};
                $httpBackend.expectPUT('/api/person/' + person.id, person).respond(200);

                service.updatePersonDetails(person).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        });
    })
});
