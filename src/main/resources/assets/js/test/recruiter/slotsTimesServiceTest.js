define(['angular', 'angularMocks', 'application/recruiter/services/tdprSlotsTimesService'], function (angular) {

    describe('tdprSlotsTimesService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var $service;

        beforeEach(inject(function (_tdprSlotsTimesService_, _$httpBackend_) {
            $service = _tdprSlotsTimesService_;
            $httpBackend = _$httpBackend_;
        }));

        describe('fetchSlotsTimes', function () {
            it('should return empty object on error', function () {
                $httpBackend.expectGET('/api/slots_times/all').respond(400, '');

                $service.fetchSlotsTimes().then(function (response) {
                    expect(response.error).toEqual("Failed");
                });

                $httpBackend.flush();
            });
        });

        describe('fetchSlotsTimes', function () {
            it('should return object with slots dates on success', function () {
                var expectedSlotsTimes = [{"id": 1, "startTime": "08:00:00", "endTime": "08:30:00"},
                    {"id": 2, "startTime": "08:30:00", "endTime": "09:00:00"},
                    {"id": 3, "startTime": "09:00:00", "endTime": "09:30:00"},
                    {"id": 4, "startTime": "09:30:00", "endTime": "10:00:00"}];
                $httpBackend.expectGET('/api/slots_times/all').respond(200, expectedSlotsTimes);

                $service.fetchSlotsTimes().then(function (response) {
                    expect(response).toEqual(expectedSlotsTimes);
                    expect(response.length).toEqual(4);
                });

                $httpBackend.flush();
            });
        })
    })
});
