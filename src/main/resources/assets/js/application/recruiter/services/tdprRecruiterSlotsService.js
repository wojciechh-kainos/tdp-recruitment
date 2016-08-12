define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService', 'notification'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', 'tdprDateService', 'dateFilter', 'AvailabilityEnum', function ($http, $q, tdprDateService, dateFilter, AvailabilityEnum) {
        var service = {};

        service.updateSlots = function (slots, personId, startDate, endDate) {
            return $http.put("/api/slots/update/" + personId + "/" + startDate + "/" + endDate, slots).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Failed to update slots for person. Could not change past days.";
                return $q.reject(err);
            });
        };

        service.filterSlots = function (slots, day) {
            var compareData = dateFilter(day, "yyyy-MM-dd");
            return _.filter(slots, {"day": compareData});
        };

        service.reformatSlots = function (slots, personId) {
            return _.map(slots,
                function (value) {
                    return {
                        slotsDate: value.day,
                        person: {id: personId},
                        slot: {id: value.number},
                        type: {id: AvailabilityEnum[value.type].id}
                    }
                });
        };

        service.prepareAndUpdateSlots = function (slots, personId, startDay, endDay) {
            var startDayFormat = dateFilter(startDay, "dd-MM-yyyy");
            var endDayFormat = dateFilter(endDay, "dd-MM-yyyy");

            return service.updateSlots(
                service.reformatSlots(slots, personId),
                personId,
                startDayFormat,
                endDayFormat
            );
        };

        return service;
    }]);
});
