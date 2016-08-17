define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterViewPairsOfInterviewersService', ['$http', '$q', function ($http, $q) {
        var service = {};

        service.createPathParams = function(roles, startDate, endDate){

            var startDay =  startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
            var endDay =  endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();

            if(roles.length == 0 || !roles || !startDay || !endDay){
                return false;
            }

            var pathParams = "startDate=" + startDay;
            pathParams += "&endDate=" + endDay;

            for(var i = 0; i < roles.length; i++){
                switch(roles[i]){
                    case "isDev": pathParams += "&isDev=true"; break;
                    case "isTest": pathParams += "&isTest=true"; break;
                    case "isWeb": pathParams += "&isOps=true"; break;
                }
            }

            return pathParams;
        }

        service.getPairs = function(roles, startDay, endDay){
            var pathParams = this.createPathParams(roles, startDay, endDay);
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
        }

        return service;
    }]);
});
