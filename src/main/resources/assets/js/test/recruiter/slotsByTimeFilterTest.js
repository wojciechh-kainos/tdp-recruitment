define(['angular', 'application/recruiter/filters/tdprSlotsByTimeFilter', 'application/recruiter/tdprRecruiterModule'], function (angular) {
    describe('Slots by time filter', function () {
        'use strict';

        var $filter;

        beforeEach(function () {
            module('tdprRecruiterModule');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });
        });

        it('should return only some of the slots', function () {
            var result, data = [{"id": 1, "startTime": "08:00:00", "endTime": "08:30:00"},
                {"id": 2, "startTime": "08:30:00", "endTime": "09:00:00"},
                {"id": 3, "startTime": "09:00:00", "endTime": "09:30:00"},
                {"id": 4, "startTime": "09:30:00", "endTime": "10:00:00"},
                {"id": 5, "startTime": "10:00:00", "endTime": "10:30:00"},
                {"id": 6, "startTime": "10:30:00", "endTime": "11:00:00"},
                {"id": 7, "startTime": "11:00:00", "endTime": "11:30:00"},
                {"id": 8, "startTime": "11:30:00", "endTime": "12:00:00"},
                {"id": 9, "startTime": "12:00:00", "endTime": "12:30:00"},
                {"id": 10, "startTime": "12:30:00", "endTime": "13:00:00"},
                {"id": 11, "startTime": "13:00:00", "endTime": "13:30:00"},
                {"id": 12, "startTime": "13:30:00", "endTime": "14:00:00"},
                {"id": 13, "startTime": "14:00:00", "endTime": "14:30:00"},
                {"id": 14, "startTime": "14:30:00", "endTime": "15:00:00"},
                {"id": 15, "startTime": "15:00:00", "endTime": "15:30:00"},
                {"id": 16, "startTime": "15:30:00", "endTime": "16:00:00"},
                {"id": 17, "startTime": "16:00:00", "endTime": "16:30:00"},
                {"id": 18, "startTime": "16:30:00", "endTime": "17:00:00"}];


            // Act.
            result = $filter('slotsByTime')(data, '12:00:00', '14:00:00');

            // Assert.
            expect(result).toEqual(
                [{"id": 9, "startTime": "12:00:00", "endTime": "12:30:00"},
                {"id": 10, "startTime": "12:30:00", "endTime": "13:00:00"},
                {"id": 11, "startTime": "13:00:00", "endTime": "13:30:00"},
                {"id": 12, "startTime": "13:30:00", "endTime": "14:00:00"}]
            );
        });
    });
});