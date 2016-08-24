define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprBase64Service', 'ngCookies'], function (angular, tdprAuthModule) {
    tdprAuthModule.service('tdprAuthService', ['$cookieStore', '$http', '$q', 'tdprBase64Service', '$state', 'Notification', '$q', '$location', function ($cookieStore, $http, $q, tdprBase64Service, $state, Notification, $q, $location) {

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
            return;
        };

        service.isUserLoggedIn = function() {
            return currentUser.token ? true : false;
        };

        service.getCurrentUser = function() {
            return currentUser;
        }

        service.isUserAuthorized = function (role) {
            var deferred = $q.defer();

            if(role === 'recruiter') {
                if(currentUser.isRecruiter) {
                    deferred.resolve();
                } else {
                    Notification.error('You do not have permissions to view this page.');
                    deferred.reject();
                }
            }
            return deferred.promise;
        };

        service.isUserAuthenticated = function () {
            var deferred = $q.defer();

            if (service.isUserLoggedIn()) {
                deferred.resolve();
            } else {
                $location.path('/login');
                Notification.error('You need to sign in to view this page.');
            }
            return deferred.promise;
        };

        service.validateSession = function () {
            service.checkCookies();
            if(!service.isUserLoggedIn()) {
                return;
            }

            return $http.get('/api/auth/validateToken?token=' + currentUser.token).then(function(response) {
                    return response;
                }, function() {
                    service.clearCredentials();
                    $location.path('/login');
                    Notification.error('Your session has expired. Please log in.');
                }
            );
        };

        return service;
    }]);
});
