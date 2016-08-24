define(['angular', 'angularMocks', 'application/recruiter/controllers/tdprAddPersonController'], function (angular) {
    describe('addPersonController', function () {
        'use strict';

        var person;
        var $scope;
        var $state;
        var Notification;
        var tdprWeekTableController;
        var tdprPersonsService;
        var createPersonDeferred;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_, _$state_) {
                var BandLevelEnum = {
                    "1": "1 - Principal",
                    "2": "2 - Manager",
                    "3": "3 - Consultant",
                    "4": "4 - Senior associate",
                    "5": "5 - Associate",
                    "6": "6 - Trainee"
                };

                person = {};
                $state = _$state_;
                $scope = _$rootScope_.$new();
                $scope.person = {"bandLevel": "5"};
                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);
                tdprPersonsService = jasmine.createSpyObj('tdprPersonsService', ['createPerson']);

                createPersonDeferred = _$q_.defer();
                tdprPersonsService.createPerson.and.returnValue(createPersonDeferred.promise);

                tdprWeekTableController = $controller('tdprAddPersonController', {
                    $scope: $scope,
                    tdprPersonsService: tdprPersonsService,
                    $state: $state,
                    Notification: Notification,
                    BandLevelEnum: BandLevelEnum
                });
            })
        );

        describe('create', function () {
            it('should parse bandLevel from form to integer', function () {
                $scope.create(person);

                expect(person.bandLevel).toEqual(5);
            });

            it('should show notification and call goHome method on success', function () {
                spyOn($scope, 'goHome');
                createPersonDeferred.resolve();

                $scope.create(person);
                $scope.$apply();

                expect(tdprPersonsService.createPerson).toHaveBeenCalledWith(person);
                expect(Notification.success).toHaveBeenCalledWith('Interviewer added');
                expect($scope.goHome).toHaveBeenCalled();
            });

            it('should show notification on error', function () {
                var message = "someDummyMessage";
                createPersonDeferred.reject({"message": message});

                $scope.create(person);
                $scope.$apply();

                expect(tdprPersonsService.createPerson).toHaveBeenCalledWith(person);
                expect(Notification.error).toHaveBeenCalledWith(message);
            });
        });

        describe('goHome', function () {
            it('should redirect to home recruiter state', function () {
                spyOn($state, 'go');

                $scope.goHome();

                expect($state.go).toHaveBeenCalledWith('tdpr.recruiter.home');
            });
        });
    })
});
