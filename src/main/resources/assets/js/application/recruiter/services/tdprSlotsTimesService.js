define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprSlotsTimesService', ['$http', '$q', function ($http, $q) {

        var slotsTimes = {};

        this.fetchSlotsTimes = function(){
            return $http.get('/api/slots_times/all').then(function(response){
                    slotsTimes = response.data;
                    return response.data;
                },
                function(error){
                    return $q.reject(error.message);
                });
        };

        this.getSlotsTimes = function() {
            return slotsTimes;
        };

    }]);
});