define(['angular', 'application/auth/tdprAuthModule'], function (angular, tdprAuthModule) {
    tdprAuthModule.service('tdprActivateService', ['$http', function ($http) {


        this.checkIfPersonWithActivationLinkExists = function (activationLink) {
            return $http.get("api/auth/activate/" + activationLink);
        }

        this.activatePerson = function (person) {
            return $http.put("api/auth/activate/" + person.id);
        }

    }]);
});
