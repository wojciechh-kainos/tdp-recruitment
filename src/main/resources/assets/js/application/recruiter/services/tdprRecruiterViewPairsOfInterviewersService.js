define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprRecruiterViewPairsOfInterviewersService', ['$http', '$q', function ($http, $q) {
        var service = {};

        service.createPathParams = function(personId, roles, day){
            if(personId === null || personId == "")
                return false;
            if(roles.length == 0 || roles === null)
                return false;
            if(day == null || day == "")
                return false;

            var pathParams = "personId=" + personId;
            for(var i = 0; i < roles.length; i++){
                switch(roles[i]){
                    case "isDev": pathParams += "&isDev=true"; break;
                    case "isTest": pathParams += "&isTest=true"; break;
                    case "isOps": pathParams += "&isOps=true"; break;
                }
            }
            pathParams += "&date=" + day;
            return pathParams;
        }

        service.getPairs = function(personId, roles, day){
            var pathParams = this.createPathParams(personId, roles, day);
            if(!pathParams)
                return false;

            return $http.get('api/pair/find?' + pathParams).then(function(response){
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