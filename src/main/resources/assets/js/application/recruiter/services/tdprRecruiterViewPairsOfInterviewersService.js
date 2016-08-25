define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterViewPairsOfInterviewersService', ['$http', '$q', function ($http, $q) {
        var service = {};

        service.getPairs = function(roles, startDay, endDay, startTime, endTime){
            var pathParams = this.createPathParams(roles, startDay, endDay, startTime, endTime);
            if(!pathParams){
                return $q.reject("Wrong parameters");
            }

            return $http.get('api/pairs?' + pathParams).then(function(response){
                    return response.data;
                },
                function(error){
                    return $q.reject(error.message);
                });
        };

        service.createPathParams = function(roles, startDate, endDate, startTime, endTime) {

            if (!roles || !startDate || !endDate || !startTime || !endTime || !(startDate instanceof Date && endDate instanceof Date)) {
                return false;
            }

            var startDay =  startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
            var endDay =  endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();

            var pathParams = "startDate=" + startDay;
            pathParams += "&endDate=" + endDay;
            pathParams += "&startTime=" + startTime;
            pathParams += "&endTime=" + endTime;

            roles.forEach(function(element){
                switch(element){
                    case "isDev": pathParams += "&isDev=true"; break;
                    case "isTest": pathParams += "&isTest=true"; break;
                    case "isOps": pathParams += "&isOps=true"; break;
                    case "isOther": pathParams += "&isOther=true"; break;
                }
            })

            return pathParams;
        };

        return service;
    }]);
});
