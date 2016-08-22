define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService', 'notification'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', 'tdprDateService', 'dateFilter', 'AvailabilityEnum', function ($http, $q, tdprDateService, dateFilter, AvailabilityEnum) {

        this.updateSlots = function (slots, personId) {
            return $http.put("/api/slots/recruiter", this.reformatSlots(slots, personId)).then(function (response) {
                return response;
            }, function (err) {
                err.message = "Failed to update slots for person. Could not change past days.";
                return $q.reject(err);
            });
        };

        this.filterSlots = function (slots, day) {
            var compareData = dateFilter(day, "yyyy-MM-dd");
            return _.filter(slots, {"day": compareData});
        };

        this.reformatSlots = function (slots, personId) {
            var filtered = _.filter(slots, function (value) {
                return value.type !== "";
            });

            return _.map(filtered,
                function (value) {
                    return {
                        slotDate: value.day,
                        person: {id: personId},
                        slotTime: {id: value.number},
                        type: {id: AvailabilityEnum[value.type].id},
                        id: value.id
                    }
                });
        };
    }]);
});
