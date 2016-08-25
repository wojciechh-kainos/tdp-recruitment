define(['angular', 'angularMocks', 'application/auth/controllers/tdprActivateController'], function (angular) {
    describe('tdprActivateController', function () {
        'use strict';

        var $scope;
        var $state;
        var Notification;
        var tdprActivateController;
        var tdprActivateService;
        var checkIfPersonWithActivationLinkExistsDeferred;
        var activatePersonDeferred;

        beforeEach(angular.mock.module('tdprAuthModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_, _$state_) {
                $state = _$state_;
                $scope = _$rootScope_.$new();

                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);
                tdprActivateService = jasmine.createSpyObj('tdprActivateService', ['checkIfPersonWithActivationLinkExists', 'activatePerson']);

                checkIfPersonWithActivationLinkExistsDeferred = _$q_.defer();
                activatePersonDeferred = _$q_.defer();
                tdprActivateService.checkIfPersonWithActivationLinkExists.and.returnValue(checkIfPersonWithActivationLinkExistsDeferred.promise);
                tdprActivateService.activatePerson.and.returnValue(activatePersonDeferred.promise);
                spyOn($state, 'go');

                tdprActivateController = $controller('tdprActivateController', {
                    $scope: $scope,
                    tdprActivateService: tdprActivateService,
                    $state: $state,
                    Notification: Notification
                });
            })
        );

        describe('actions on entering controller', function() {

            it('should call checkIfPersonWithActivationLinkExists function from service',function() {
                expect(tdprActivateService.checkIfPersonWithActivationLinkExists).toHaveBeenCalled();
            });

            it('should redirect to login page',function() {
                checkIfPersonWithActivationLinkExistsDeferred.reject();
                $scope.$apply();

                expect($state.go).toHaveBeenCalledWith('tdpr.login');
            });
        })

        describe('activate person', function() {

            it('should throw error',function() {
                $scope.activatePerson();
                $scope.$apply();
                expect(Notification.error).toHaveBeenCalledWith("Passwords are not the same or are incorrect");
            });
        })

    })
});

