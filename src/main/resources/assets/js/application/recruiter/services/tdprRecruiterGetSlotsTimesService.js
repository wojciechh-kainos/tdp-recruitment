define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterGetSlotsTimesService', ['$http', '$q', function ($http, $q) {
        var service = {};
        var data = {};

        function getFormattedSlots (slots) {
            var array = {};

            for(var i=0; i<slots.length; i++) {
                array[ slots[i].id ] = slots[i];
            }

            return array;
        }

        service.getSlots = function() {
            return data;
        };

        service.getSlotsTimes = function(){
            return $http.get('/api/slots_times/all').then(function(response){
                data = response.data;
                return response.data;
            },
            function(error){
                return $q.reject(error.message);
            });
        };

        return service;
    }]);
});
