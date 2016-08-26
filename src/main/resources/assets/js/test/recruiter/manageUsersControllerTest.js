define(['angular', 'angularMocks', 'application/recruiter/controllers/tdprManageUsersController'], function (angular) {
    describe('manageUsersController', function () {
        'use strict';

        var person;
        var $scope;
        var $state;
        var Notification;
        var tdprManageUsersController;
        var tdprPersonsService;
        var fetchPersonsDeferred;
        var managePersonsDeferred;
        var resendActivationLinkDeferred;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_, _$state_) {
                $state = _$state_;
                $scope = _$rootScope_.$new();
                person = {"id": "5",
                                "firstName": "Jan",
                                "lastName": "Kowalski",
                                "active": true
                };

                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);
                tdprPersonsService = jasmine.createSpyObj('tdprPersonsService', ['fetchPersons', 'managePerson', 'resendActivationLink']);

                fetchPersonsDeferred = _$q_.defer();
                managePersonsDeferred = _$q_.defer();
                resendActivationLinkDeferred = _$q_.defer();
                tdprPersonsService.fetchPersons.and.returnValue(fetchPersonsDeferred.promise);
                tdprPersonsService.managePerson.and.returnValue(managePersonsDeferred.promise);
                tdprPersonsService.resendActivationLink.and.returnValue(resendActivationLinkDeferred.promise);

            tdprManageUsersController = $controller('tdprManageUsersController', {
                    $scope: $scope,
                    tdprPersonsService: tdprPersonsService,
                    $state: $state,
                    Notification: Notification
                });
            })
        );

        describe('manage Persons', function() {
            it('should call fetchPersons function from service',function(){
                expect(tdprPersonsService.fetchPersons).toHaveBeenCalled();
            });

            it('should throw success notification', function(){
                managePersonsDeferred.resolve({});

                $scope.managePerson(person);
                $scope.$apply();

                expect(tdprPersonsService.managePerson).toHaveBeenCalledWith(person);
                expect(Notification.success).toHaveBeenCalledWith(person.firstName + " " + person.lastName  + " has been disabled.");
            });

            it('should throw error notification', function(){
                managePersonsDeferred.reject();

                $scope.managePerson(person);
                $scope.$apply();

                expect(tdprPersonsService.managePerson).toHaveBeenCalledWith(person);
                expect(Notification.error).toHaveBeenCalledWith("Something went wrong with your request.");
            });

        })

        describe('When resending activation link', function() {
            it('should throw success notification', function(){
                resendActivationLinkDeferred.resolve({});

                $scope.resendActivationLink(person);
                $scope.$apply();

                expect(tdprPersonsService.resendActivationLink).toHaveBeenCalledWith(person);
                expect(Notification.success).toHaveBeenCalledWith("Activation link successfully sent to: " + person.firstName + " " + person.lastName);
            });

            it('should throw error notification', function(){
                resendActivationLinkDeferred.reject();

                $scope.resendActivationLink(person);
                $scope.$apply();

                expect(tdprPersonsService.resendActivationLink).toHaveBeenCalledWith(person);
                expect(Notification.error).toHaveBeenCalledWith("Something went wrong with sending the activation link!");
            });

        })

    })
});
