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
            var array = [];
            var dateObj = tdprDateService.resetDate(day);

            for (var key in slots) {
                if (!slots.hasOwnProperty(key)) continue;

                var compareDay = tdprDateService.resetDate(slots[key].day);

                var slotType = slots[key].type ? slots[key].type : "empty";

                if (compareDay.getTime() === dateObj.getTime()) {
                    array.push({
                        slotsDate: tdprDateService.resetDate(compareDay),
                        person: {id: personId},
                        slot: {id: slots[key].slot},
                        type: {id: AvailabilityEnum[slotType].id}
                    });
                }
            }
            return array;
        };

        service.prepareAndUpdateSlots = function (slots, personId, day) {
            var formattedData = dateFilter(day, "dd-MM-yyyy");

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
