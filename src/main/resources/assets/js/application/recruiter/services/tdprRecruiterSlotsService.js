define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', 'tdprDateService', 'dateFilter', 'AvailabilityEnum', function ($http, $q, tdprDateService, dateFilter, AvailabilityEnum) {
        var service = {};

        service.updateSlots = function (slots, personId, startDate, endDate) {
            return $http.put("/api/slots/update/" + personId + "/" + startDate + "/" + endDate, slots).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Failed to update slots for person.";
                return $q.reject(err);
            });
        };

        service.reformatSlots = function (slots, day, personId) {
            var compareData = dateFilter(day, "yyyy-MM-dd");

            var filtered = _.filter(slots, {"day": compareData});

            return _.map(filtered, function (value) {
                return {
                    slotsDate: compareData,
                    person: {id: personId},
                    slot: {id: value.slot},
                    type: {id: AvailabilityEnum[value.type].id}

                }
            });
        };

        service.prepareAndUpdateSlots = function (slots, personId, day) {
            var formattedData = tdprDateService.formatDate(day);

            return service.updateSlots(
                service.reformatSlots(slots, day, personId),
                personId,
                formattedData,
                formattedData
            );
        };

        return service;
    }]);
});
