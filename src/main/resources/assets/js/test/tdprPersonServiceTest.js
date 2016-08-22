define(['angular', 'angularMocks', 'application/interviewer/services/tdprPersonService'], function (angular) {

    describe('tdprPersonServiceTest', function () {
        beforeEach(angular.mock.module('tdprInterviewerModule'));

        var $httpBackend;
        var $service;

        beforeEach(inject(function (_tdprPersonService_, _$httpBackend_) {
            $service = _tdprPersonService_;
            $httpBackend = _$httpBackend_;
        }));

        describe('When correct request', function () {
            it('should return specified object', function(){
                var personId = 1;
                var date = '01-08-2016';

                var expectedResponse = {
                     "id": 55,
                     "person": {
                       "id": 1,
                       "email": "a@a.com",
                       "firstName": "Marek",
                       "lastName": "Dzik",
                       "password": null,
                       "admin": false,
                       "isDev": true,
                       "isTest": false,
                       "isOps": false,
                       "bandLevel": 1,
                       "activationCode": null,
                       "active": true,
                       "slotList": null,
                       "noteList": null
                     },
                     "description": "First week!",
                     "date": "2016-08-01"
                };

                $httpBackend.expectGET('/api/person/' + personId + '/getNote?' + 'date=' + date).respond(200, expectedResponse);
                $service.getNote(personId, date).then(function(response){
                    expect(response.status).toEqual(200);
                    expect(response.data).toEqual(expectedResponse);
                });
                $httpBackend.flush();
            });

            it('should return nothing', function(){
                var personId = 1;
                var dateWithoutNoteCreated = '01-08-2016';
                var expectedResponse = {};

                $httpBackend.expectGET('/api/person/' + personId + '/getNote?' + 'date=' + dateWithoutNoteCreated).respond(204, expectedResponse);
                $service.getNote(personId, dateWithoutNoteCreated).then(function(response){
                    expect(response.status).toEqual(204);
                    expect(response.data).toEqual(expectedResponse);
                });
                $httpBackend.flush();
            });
        });

        describe('When corrupted request', function () {
            it('should return error', function(){
                var personId = 1;
                var corruptedDate = '0';

                var expectedResponse = {
                     "code": 500,
                     "message": "There was an error processing your request. It has been logged (ID ce5e7bbf986c3c5d)."
                 };

                $httpBackend.expectGET('/api/person/' + personId + '/getNote?' + 'date=' + corruptedDate).respond(500, expectedResponse);
                $service.getNote(personId, corruptedDate).then(function(response){
                    expect(response.status).toEqual(500);
                    expect(response.data).toEqual(expectedResponse);
                });
                $httpBackend.flush();
            });

            it('should return nothing', function() {
                var personId = 1;
                var dateWithoutNoteCreated = '01-08-2016';
                var expectedResponse = {};

                $httpBackend.expectGET('/api/person/' + personId + '/getNote?' + 'date=' + dateWithoutNoteCreated).respond(204, expectedResponse);
                $service.getNote(personId, dateWithoutNoteCreated).then(function(response){
                    expect(response.status).toEqual(204);
                    expect(response.data).toEqual(expectedResponse);
                });
                $httpBackend.flush();
            });
        });

        describe('When correct updateNote request', function () {
            it('should return id', function() {
                var noteId = 1;
                var personId = 2;
                var description = "This is my test content!";
                var date = "2012-01-01";

                var dataToSend = {
                    "id": noteId,
                    "person": {
                      "id": personId
                    },
                    "description": description,
                    "date": date
                }

                var expectedResponse = 1;

                $httpBackend.expectPUT('/api/person/updateNote', dataToSend).respond(200, expectedResponse);
                $service.updateNote(dataToSend).then(function(response) {
                    expect(response.status).toEqual(200);
                    expect(response.data).toEqual(expectedResponse);
                });
                $httpBackend.flush();
            });

            it('should return error message', function() {
                var noteId = 1;
                var personId = 2;
                var description = "This is my test content!";
                var corruptedDate = "-";

                var dataToSend = {
                    "id": noteId,
                    "person": {
                      "id": personId
                    },
                    "description": description,
                    "date": corruptedDate
                }

                var expectedResponse = {
                     "code": 400,
                     "message": "Unable to process JSON"
                   }

                $httpBackend.expectPUT('/api/person/updateNote', dataToSend).respond(400, expectedResponse);
                $service.updateNote(dataToSend).then(function(response) {
                    expect(response.status).toEqual(300);
                    expect(response.data).toEqual(expectedResponse);
                });
                $httpBackend.flush();
            });
        })
    })
});