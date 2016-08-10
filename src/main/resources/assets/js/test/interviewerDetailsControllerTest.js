define(['angular', 'angularMocks', 'application/interviewer/controllers/tdprInterviewerDetailsController', 'application/interviewer/services/tdprPersonService'], function (angular) {

    describe('tdprInterviewerDetailsController', function () {
        beforeEach(angular.mock.module('tdprInterviewerModule'));

        var $scope;
        var $state;
        var $filter;
        var personId;
        var Notification;
        var personService;
        var personDetailsDeferred;
        var updatePersonDeferred;

        beforeEach(inject(function ($controller, tdprPersonService, _$rootScope_, _$state_, _$filter_, $q) {
            personId = 42;
            $state = _$state_;
            $filter = _$filter_;
            $scope = _$rootScope_.$new();
            personService = tdprPersonService;
            personDetailsDeferred = $q.defer();
            updatePersonDeferred = $q.defer();
            Notification = { success: function () {} };

            spyOn(personService, 'getPersonDetails').and.returnValue(personDetailsDeferred.promise);
            spyOn(personService, 'updatePersonDetails').and.returnValue(updatePersonDeferred.promise);

            $controller('tdprInterviewerDetailsController', {
                $scope: $scope,
                tdprPersonService: personService,
                Notification: Notification,
                $stateParams: {id: personId}
            });
        }));

        it('should call getPersonDetails at init', function () {
            expect(personService.getPersonDetails).toHaveBeenCalledWith(personId);
        });

        it('should store data received from service in model', function () {
            personDetailsDeferred.resolve({
                data: {
                    bandLevel: 9001,
                    defaultStartHour: '05:15:01',
                    defaultFinishHour: '22:49:31'
                }
            });

            $scope.$apply();

            expect($scope.person.bandLevel).toEqual("9001");
            expect($scope.person.defaultStartHour).toEqual(new Date(1970, 0, 1, 5, 15, 1));
            expect($scope.person.defaultFinishHour).toEqual(new Date(1970, 0, 1, 22, 49, 31));
        });

        describe('goHome', function () {
            it('should redirect user to home state', function () {
                spyOn($state, 'go');

                $scope.goHome();

                expect($state.go).toHaveBeenCalledWith('tdpr.interviewer.home', {'id': personId});
            });
        });

        describe('updateDetails', function () {
            it('should call updatePersonDetails with proper json', function () {
                updatePersonDeferred.resolve({});
                $scope.person = {
                    dummyData: 42,
                    bandLevel: "9001",
                    defaultStartHour: new Date(1970, 0, 1, 5, 15, 1),
                    defaultFinishHour: new Date(1970, 0, 1, 22, 49, 31)
                };

                $scope.updateDetails();

                expect(personService.updatePersonDetails).toHaveBeenCalledWith({
                    dummyData: 42,
                    bandLevel: 9001,
                    defaultStartHour: '05:15:01',
                    defaultFinishHour: '22:49:31'
                });
            });

            it('should show notification on success', function () {
                updatePersonDeferred.resolve({});
                spyOn(Notification, 'success');
                $scope.person = {};

                $scope.updateDetails();
                $scope.$apply();

                expect(Notification.success).toHaveBeenCalledWith({message: 'Details updated!', delay: 2000});
            });
        });
    });
});
