define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterViewPairsOfInterviewersService', ['$http', '$q', function ($http, $q) {
        var service = {};

        service.getPairs = function(roles, startDay, endDay, startTime, endTime){
            var pathParams = this.createPathParams(roles, startDay, endDay, startTime, endTime);
            if(!pathParams){
                return false;
            }

            return $http.get('api/pairs?' + pathParams).then(function(response){
                    return response.data;
                },
                function(error){
                    error.message = "Getting data form server failed";
                    return $q.reject(error.message);
                });
        };

        service.createPathParams = function(roles, startDate, endDate, startTime, endTime) {

            if (!roles || !startDate || !endDate || !startTime || !endTime) {
                return false;
            }

            var startDay =  startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
            var endDay =  endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();

            if(roles.length == 0 || !roles || !startDay || !endDay){
                return false;
            }

            var pathParams = "startDate=" + startDay;
            pathParams += "&endDate=" + endDay;
            pathParams += "&startTime=" + startTime;
            pathParams += "&endTime=" + endTime;

            for(var i = 0; i < roles.length; i++){
                switch(roles[i]){
                    case "isDev": pathParams += "&isDev=true"; break;
                    case "isTest": pathParams += "&isTest=true"; break;
                    case "isOps": pathParams += "&isOps=true"; break;
                    case "isOther": pathParams += "&isOther=true"; break;
                }
            }

            return pathParams;
        };

        return service;
    }]);
});
