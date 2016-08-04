define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterSlotsService', ['$http', '$q', function ($http, $q) {
        var service = {};

        this.updateSlots = function(slots, personId, startDate, endDate){
            return $http.put("/api/slots/update/" + personId +"/" + startDate + "/" + endDate, slots);
        };

        return service;
    }]);
});
