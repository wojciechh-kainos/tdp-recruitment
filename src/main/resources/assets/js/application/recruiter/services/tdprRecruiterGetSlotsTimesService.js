define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterGetSlotsTimesService', ['$http', '$q', function ($http, $q) {
        var service = {};
        var data = {};
        var slotsTimeElementCount = 0;

        function getFormattedSlots(slots) {
            var array = {};

            slotsTimeElementCount = slots.length;

            _.forEach(slots, function (value) {
                array[value.id] = value;
            });

            return array;
        }

        service.getSlots = function () {
            return data;
        };

        service.getSlotsTimesCount = function () {
            return slotsTimeElementCount;
        };

        service.getSlotsTimes = function () {
            return $http.get('/api/slots_times/all').then(function (response) {
                    data = getFormattedSlots(response.data);
                    return response.data;
                },
                function (error) {
                    return $q.reject(error.message);
                });
        };

        return service;
    }]);
});
