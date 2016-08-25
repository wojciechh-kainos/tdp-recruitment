define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprBase64Service', 'ngCookies'], function (angular, tdprAuthModule) {
    tdprAuthModule.service('tdprAuthService', ['$cookieStore', '$http', '$q', 'tdprBase64Service', function ($cookieStore, $http, $q, tdprBase64Service) {

        var currentUser = {};

        var service = {};

        service.login = function (email, password) {
            return $http.post('/api/auth/login', {email: email, password: password}).then(function (res) {
                var user = res.data;

                currentUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    token: user.token,
                    isRecruiter: user.admin
                };

                service.setCredentials(user.email, user.token);

                return res.data;
            }, function (err) {
               return $q.reject(err);
            });
        };

        service.logout = function () {
            if(!service.isUserLoggedIn()) {
                return;
            }

           service.clearCredentials();
        };

        service.setCredentials = function (email, password) {
            var authdata = tdprBase64Service.encode(email + ':' + password);

            var globals = {
                currentUser: currentUser
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

            if(!$cookieStore.get('globals')) {
                $cookieStore.put('globals', globals);
            }
        };

        service.clearCredentials = function () {
            $cookieStore.remove('globals');
            currentUser = {};
            $http.defaults.headers.common.Authorization = '';
        };

        service.checkCookies = function() {
            var globals = $cookieStore.get('globals');
            if (globals) {
                currentUser = globals.currentUser;
                service.setCredentials(currentUser.email, currentUser.token);
            }
        };

        service.isUserLoggedIn = function() {
            return currentUser.token ? true : false;
        };

        service.getCurrentUser = function() {
            return currentUser;
        }

        service.isUserAuthorized = function (role) {
            if(role === 'recruiter') {
                return currentUser.isRecruiter;
            }
            if(role === 'interviewer') {
                return !currentUser.isRecruiter;
            }
        };

        service.validateSession = function () {
            var deferred = $q.defer();
            $http.get('/api/auth/validateToken?token=' + currentUser.token).then(function(response) {
                    deferred.resolve();
                }, function() {
                    service.clearCredentials();
                    deferred.reject();
                }
            );
            return deferred.promise;
        };

        return service;
    }]);
});
