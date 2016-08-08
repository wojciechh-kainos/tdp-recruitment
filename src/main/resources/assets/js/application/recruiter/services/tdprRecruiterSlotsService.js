define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', 'tdprDateService', 'dateFilter', 'AvailabilityEnum', function ($http, $q, tdprDateService, dateFilter, AvailabilityEnum) {
        var updateSlots = function(slots, personId, startDate, endDate) {
            return $http.put("/api/slots/update/" + personId +"/" + startDate + "/" + endDate, slots);
        };

        var reformatSlots = function (slots, day) {
            var array = [];
            var dateObj = tdprDateService.resetDate(day);

            for (var i = 0; i < slots.length; i++) {
                var compareDay = tdprDateService.resetDate(slots[i].day);

                if (compareDay.getTime() === dateObj.getTime()) {
                    array.push({
                        slotsDate: tdprDateService.resetDate(compareDay),
                        person: null,
                        slot: {id: slots[i].slot},
                        type: {id: AvailabilityEnum[slots[i].type ? slots[i].type : "unavailable"].priority}
                    });
                }
            }
            return array;
        };

        var prepareAndUpdateSlots = function (slots, personId, day) {
            var formattedData = dateFilter(day, "dd-MM-yyyy");

            return updateSlots(
                reformatSlots(slots, day),
                personId,
                formattedData,
                formattedData
            );
        };

        this.prepareAndUpdateSlots = function (slots, personId, day) {
            return prepareAndUpdateSlots(slots, personId, day);
        };

        this.updateSlots = function(slots, personId, startDate, endDate){
            return updateSlots(slots, personId, startDate, endDate);
        };
    }]);
});
