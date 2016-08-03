define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterGetSlotsTimesService', ['$http', '$q', function ($http, $q) {
        var service = {};
        var data = {};

        function getFormatedSlots (slots) {
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
                data = getFormatedSlots(response.data);
                return response.data;
            },
            function(error){
                console.log(error);
                console.log("get slots times failed");
                return {};
            });
        };

        return service;
    }]);
});
