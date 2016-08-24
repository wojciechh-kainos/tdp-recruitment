define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService', 'notification'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', 'tdprDateService', 'dateFilter', 'AvailabilityEnum', function ($http, $q, tdprDateService, dateFilter, AvailabilityEnum, DateFormat) {

        this.updateSlots = function (slots) {
            return $http.put("/api/slots/recruiter", this.reformatSlots(slots)).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Failed to update slots for person. Could not change past days.";
                return $q.reject(err);
            });
        };

        this.filterSlots = function (slots, day) {
            var compareData = dateFilter(day, DateFormat);
            return _.filter(slots, {"day": compareData});
        };

        this.reformatSlots = function (slots) {
            var filtered = _.filter(slots, function (value) {
                return value.type !== "";
            });

            return _.map(filtered,
                function (slot) {
                    return {
                        slotDate: slot.day,
                        person: {id: slot.person},
                        slotTime: {id: slot.number},
                        type: {id: AvailabilityEnum[slot.type].id},
                        id: slot.id
                    }
                });
        };
    }]);
});
