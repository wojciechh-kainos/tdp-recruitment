define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprSlotsTimesService', ['$http', '$q', function ($http, $q) {
        
        this.fetchSlotsTimes = function(){
            return $http.get('/api/slots_times/all').then(function(response){
                    return response.data;
                },
                function(error){
                    return $q.reject(error.message);
                });
        };
    }]);
});