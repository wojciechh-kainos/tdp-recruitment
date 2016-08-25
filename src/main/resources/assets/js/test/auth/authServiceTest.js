define(['angular', 'angularMocks', 'application/auth/services/tdprAuthService'], function (angular) {

    describe('tdprAuthService', function () {
        'use strict';

        beforeEach(angular.mock.module('tdprAuthModule'));

        var $httpBackend;
        var service;
        var Notification;

        beforeEach(inject(function (_tdprAuthService_, _$httpBackend_) {
            service = _tdprAuthService_;
            $httpBackend = _$httpBackend_;
            Notification = jasmine.createSpy('Notification');

            spyOn(service, 'setCredentials');
            spyOn(service, 'clearCredentials');

        }));



        describe('When logging in with valid credentials', function () {
            it('should set cookie with username and token', function () {

                $httpBackend.expectPOST('/api/auth/login', {email: 'validUserEmail', password: 'validPassword'}).respond(200, {email: 'validUserEmail', token:'token'});

                service.login('validUserEmail', 'validPassword').then(function(result) {
                   expect(result.token).toEqual('token');
                    expect(service.setCredentials).toHaveBeenCalledWith('validUserEmail', 'token');
                });


                $httpBackend.flush();
            });
        });

        describe('When logging in with invalid credentials', function () {
            it('should return error message', function () {

                $httpBackend.expectPOST('/api/auth/login', {email: 'invalidUsername', password: 'invalidPassword'}).respond(400, {});
                service.login('invalidUsername', 'invalidPassword').then(function(result) {
                     expect(result.token).not.toBeDefined();
                 });

                expect(service.setCredentials).not.toHaveBeenCalled();

                $httpBackend.flush();
            });
        });

    });
});
