define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterGetSlotsTimesService', ['$http', function ($http) {
        var service = {};

        service.getSlotsTimes = function(){
            return $http.post('/api/slots_times/all').then(function(response){
                console.log(response);
                return response;
            },
            function(error){
                console.log(error);
                console.log("get slots times failed");
                return {};
            });
        }

        return service;
    }]);
});
