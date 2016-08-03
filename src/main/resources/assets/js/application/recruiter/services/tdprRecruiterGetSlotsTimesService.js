define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterGetSlotsTimesService', ['$http', '$q', function ($http, $q) {
        var service = {};

        service.getSlotsTimes = function(){
            return $http.get('/api/slots_times/all').then(function(response){
                return response.data;
            },
            function(error){
                error.message = "Failed";
                return $q.reject(error.message);
            });
        }
        return service;
    }]);
});
