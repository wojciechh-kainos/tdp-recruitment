define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService', 'notification'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', 'tdprDateService', 'dateFilter', 'AvailabilityEnum', function ($http, $q, tdprDateService, dateFilter, AvailabilityEnum) {

        this.updateSlots = function (slots, personId, startDate, endDate) {
            return $http.put("/api/slots/" + dateFilter(startDate, "dd-MM-yyyy") + "/" + dateFilter(endDate, "dd-MM-yyyy") + '?personId=' + personId, this.reformatSlots(slots, personId)).then(function (response) {
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
    }]);
});
