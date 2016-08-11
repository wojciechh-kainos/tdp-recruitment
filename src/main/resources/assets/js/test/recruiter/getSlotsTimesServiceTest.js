define(['angular', 'angularMocks', 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'], function (angular) {

    describe('tdprRecruiterGetSlotsTimesService', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var $httpBackend;
        var $service;

        beforeEach(inject(function (_tdprRecruiterGetSlotsTimesService_, _$httpBackend_) {
            $service = _tdprRecruiterGetSlotsTimesService_;
            $httpBackend = _$httpBackend_;
        }));

        describe('When error in request', function () {
            it('should return empty object', function(){
                $httpBackend.expectGET('/api/slots_times/all').respond(400, '');
                $service.getSlotsTimes().then(function(response){
                    expect(response.error).toEqual("Failed");
                });
                $httpBackend.flush();
            });
        })

        describe('When no errors in request', function () {
            it('should return object with slots dates', function(){
                var expectedSlotsTimes = [{"id":1,"startTime":"08:00:00","endTime":"08:30:00"},
                {"id":2,"startTime":"08:30:00","endTime":"09:00:00"},
                {"id":3,"startTime":"09:00:00","endTime":"09:30:00"},
                {"id":4,"startTime":"09:30:00","endTime":"10:00:00"},
                {"id":5,"startTime":"10:00:00","endTime":"10:30:00"},
                {"id":6,"startTime":"10:30:00","endTime":"11:00:00"},
                {"id":7,"startTime":"11:00:00","endTime":"11:30:00"},
                {"id":8,"startTime":"11:30:00","endTime":"12:00:00"},
                {"id":9,"startTime":"12:00:00","endTime":"12:30:00"},
                {"id":10,"startTime":"12:30:00","endTime":"13:00:00"},
                {"id":11,"startTime":"13:00:00","endTime":"13:30:00"},
                {"id":12,"startTime":"13:30:00","endTime":"14:00:00"},
                {"id":13,"startTime":"14:00:00","endTime":"14:30:00"},
                {"id":14,"startTime":"14:30:00","endTime":"15:00:00"},
                {"id":15,"startTime":"15:00:00","endTime":"15:30:00"},
                {"id":16,"startTime":"15:30:00","endTime":"16:00:00"},
                {"id":17,"startTime":"16:00:00","endTime":"16:30:00"},
                {"id":18,"startTime":"16:30:00","endTime":"17:00:00"}];
                $httpBackend.expectGET('/api/slots_times/all').respond(200, expectedSlotsTimes);
                $service.getSlotsTimes().then(function(response){
                    expect(response).toEqual(expectedSlotsTimes);
                    expect(response.length).toEqual(18);
                });
                $httpBackend.flush();
            });
        })
    })
});

