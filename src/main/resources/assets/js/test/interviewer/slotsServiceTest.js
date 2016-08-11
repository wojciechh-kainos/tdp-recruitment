define(['angular', 'angularMocks', 'application/interviewer/services/tdprSlotsService'], function (angular) {
    describe('personsService', function () {
        beforeEach(angular.mock.module('tdprInterviewerModule'));

        var $httpBackend;
        var service;
        var startDate;
        var endDate;
        var personId;

        beforeEach(inject(function (_tdprSlotsService_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            service = _tdprSlotsService_;

            personId = 1;
            startDate = '2016-02-14';
            endDate = '2016-02-19';
        }));

        describe('getSlots', function () {
            it('should call backend with given dates and person id', function () {
                $httpBackend.expectGET('/api/slots/week?id=' + personId + '&startDate=' + startDate + '&endDate=' + endDate).respond(200);

                service.getSlots(startDate, endDate, personId).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        });

        describe('updateSlots', function () {
            it('should call backend with given slots, dates and person id', function () {
                $httpBackend.expectPUT('/api/slots/update/' + startDate + '/' + endDate + '/' + personId).respond(200);

                var fakeSlotsObject = {};

                service.updateSlots(fakeSlotsObject, startDate, endDate, personId).then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        });

        describe('getSlotsTimes', function () {
            it('should call backend to fetch all slots times', function () {
                $httpBackend.expectGET('/api/slots_times/all').respond(200);

                service.getSlotsTimes().then(function (response) {
                    expect(response.status).toEqual(200);
                });

                $httpBackend.flush();
            });
        });
    })
});
