define(['angular', 'angularMocks', 'application/recruiter/controllers/tdprCandidatesController'], function (angular) {
    describe('tdprCandidatesController', function () {
        'use strict';

        var $scope;
        var Notification;
        var tdprAuthService;
        var tdprCandidatesService;
        var recruiters;
        var candidates;
        var candidate;
        var recruiterNotes;
        var updateCandidate;
        var ngDialog;
        var deleteCandidateDeferred;
        var createCandidateDeferred;
        var fetchCandidatesDeferred;
        var updateCandidatesDeferred;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_) {
                $scope = _$rootScope_.$new();
                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);

                tdprAuthService = jasmine.createSpyObj('tdprAuthService', ['getCurrentUser']);
                tdprAuthService.getCurrentUser.and.returnValue({});

                tdprCandidatesService = jasmine.createSpyObj('tdprCandidateService', ['deleteCandidate', 'createCandidate', 'fetchCandidates', 'updateCandidate']);
                deleteCandidateDeferred = _$q_.defer();
                tdprCandidatesService.deleteCandidate.and.returnValue(deleteCandidateDeferred.promise);

                createCandidateDeferred = _$q_.defer();
                tdprCandidatesService.createCandidate.and.returnValue(createCandidateDeferred.promise);

                fetchCandidatesDeferred = _$q_.defer();
                tdprCandidatesService.fetchCandidates.and.returnValue(fetchCandidatesDeferred.promise);

                updateCandidatesDeferred = _$q_.defer();
                tdprCandidatesService.updateCandidate.and.returnValue(updateCandidatesDeferred.promise);

                candidate = {
                    "id": 1,
                    "firstName": "Jan",
                    "lastName": "Gruszka"
                };

                updateCandidate = {
                    "id": 2,
                    "firstName": "Ania",
                    "lastName": "Gruszka",
                    "note": 'Updated note'
                };

                candidates = [
                    candidate,
                    {
                        "id": 2,
                        "firstName": "Ania",
                        "lastName": "Gruszka",
                        "note": 'note'
                    },
                    {
                        "id": 3,
                        "firstName": "Michał",
                        "lastName": "Gruszka"
                    }
                ];

                recruiters = [];

                recruiterNotes = [];

                ngDialog = {
                    open: function () {
                        return {
                            close: function () {

                            },
                            closePromise: _$q_.defer().promise
                        }
                    },
                    close: function () {
                    }
                };

                $controller("tdprCandidatesController", {
                    $scope: $scope,
                    tdprCandidatesService: tdprCandidatesService,
                    tdprAuthService: tdprAuthService,
                    candidates: candidates,
                    recruiters: recruiters,
                    recruiterNotes: recruiterNotes,
                    ngDialog: ngDialog,
                    Notification: Notification
                });
            })
        );

        describe('When click delete button', function () {
            it('should delete candidate.', function () {
                var message = 'Candidate deleting succeeded.';
                deleteCandidateDeferred.resolve({"data": 1});
                $scope.showPopUpForDelete(candidate);
                $scope.deleteCandidate(candidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(2);
            });

            it("should notificate an error and do not remove candidate when sth is wrong", function () {
                var message = 'Deleting failed.';
                deleteCandidateDeferred.reject(message);
                $scope.deleteCandidate(candidate);
                $scope.$apply();
                expect(Notification.error).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(3);
            })
        });

        describe('When click add candidate button', function () {
            it('should add candidate if data is complete', function () {
                var message = 'Candidate successfully created.';
                createCandidateDeferred.resolve(message);
                $scope.showPopupForAdd();
                $scope.create(candidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(4);
            })

            it('should not add candidate if data is not complete', function () {
                var message = 'Candidate adding failed.';
                var numberOfCandidates = $scope.candidates.length;
                createCandidateDeferred.reject(message);
                $scope.showPopupForAdd();
                $scope.create(candidate);
                $scope.$apply();
                expect(Notification.error).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(numberOfCandidates);
            })
        })

        describe('When click update button', function () {
            it('Should update candidate credentials when data filled', function () {
                var message = 'Candidate successfully updated.';
                var numberOfCandidates = $scope.candidates.length;
                expect(candidates[1].note).toEqual('note');
                updateCandidatesDeferred.resolve(updateCandidate);
                $scope.showPopupForEdit();
                $scope.update(updateCandidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(numberOfCandidates);
                expect(tdprCandidatesService.fetchCandidates).toHaveBeenCalledTimes(1);
            })

            it('Should not update candidate if data not filled', function () {
                var message = 'Candidate updating failed';
                var numberOfCandidates = $scope.candidates.length;
                updateCandidatesDeferred.reject(message);
                $scope.showPopupForEdit();
                $scope.update(updateCandidate);
                $scope.$apply();
                expect(Notification.error).toHaveBeenCalledWith(message);
                expect($scope.candidates.length).toEqual(numberOfCandidates);
                expect(tdprCandidatesService.fetchCandidates).not.toHaveBeenCalled;
            })
        })
    })
});
