define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprSlotsTimesService', ['$http', '$q', function ($http, $q) {

        var slotTimes = {};

        this.fetchSlotsTimes = function(){
            return $http.get('/api/slots_times/all').then(function(response){
                    slotTimes = response.data;
                    return response.data;
                },
                function(error){
                    return $q.reject(error.message);
                });
        };

        this.getSlotTimes = function() {
            return slotTimes;
        };

    }]);
});