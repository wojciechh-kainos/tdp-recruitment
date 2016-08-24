define(['angular', 'angularMocks', 'application/recruiter/controllers/tdprCandidatesController'], function (angular) {
    describe('tdprCandidatesController', function () {
        'use strict';

        var $scope;
        var Notification;
        var tdprCandidatesService;
        var recruiters;
        var candidates;
        var candidate;
        var ngDialog;
        var $timeout;
        var deleteCandidateDeferred;
        var createCandidateDeferred;
        var fetchCandidatesDeferred;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_) {
                $scope = _$rootScope_.$new();
                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);

                tdprCandidatesService = jasmine.createSpyObj('tdprCandidateService', ['deleteCandidate', 'createCandidate', 'fetchCandidates']);
                deleteCandidateDeferred = _$q_.defer();
                tdprCandidatesService.deleteCandidate.and.returnValue(deleteCandidateDeferred.promise);

                createCandidateDeferred = _$q_.defer();
                tdprCandidatesService.createCandidate.and.returnValue(createCandidateDeferred.promise);

                fetchCandidatesDeferred = _$q_.defer();
                tdprCandidatesService.fetchCandidates.and.returnValue(fetchCandidatesDeferred.promise);

                candidate = {
                    "id": 1,
                    "firstName": "Jan",
                    "lastName": "Gruszka"
                };
                candidates = [
                    candidate,
                    {
                        "id": 2,
                        "firstName": "Ania",
                        "lastName": "Gruszka"
                    },
                    {
                        "id": 3,
                        "firstName": "Michał",
                        "lastName": "Gruszka"
                    }
                ];

                recruiters = {};


                ngDialog = {
                    open: function () {return {close: function () {}}},
                    close: function () {}
                };

                $controller("tdprCandidatesController", {
                    $scope: $scope,
                    tdprCandidatesService: tdprCandidatesService,
                    candidates: candidates,
                    recruiters: recruiters,
                    ngDialog: ngDialog,
                    Notification: Notification
                });
            })
        );

        describe('When click delete button', function () {
            it('should delete candidate.', function () {
                deleteCandidateDeferred.resolve({"data": 1});
                $scope.removeCandidate(candidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith('Deleting candidate succeeded');
                expect($scope.candidates.length).toEqual(2);
            });

            it("should notificate an error and do not remove candidate when sth is wrong", function () {
                var message = 'Deleting failed.';
                deleteCandidateDeferred.reject(message);
                $scope.removeCandidate(candidate);
                $scope.$apply();
                expect(Notification.error).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(3);
            })
        });

        describe('When click add candidate button', function () {
            it('should add candidate if data is complete', function () {
                var message = 'Successfully created candidate.';
                createCandidateDeferred.resolve(message);
                $scope.open();
                $scope.create(candidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(3);
            })
        })
    })
});
