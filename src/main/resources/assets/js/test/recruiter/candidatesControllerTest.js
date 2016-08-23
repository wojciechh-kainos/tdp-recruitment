define(['angular', 'angularMocks', 'application/recruiter/controllers/tdprCandidatesController'], function (angular) {
    describe('tdprCandidatesController', function () {
        'use strict';

        var $scope;
        var Notification;
        var tdprCandidatesService;
        var candidates;
        var candidate;
        var ngDialog;
        var $timeout;
        var deleteCandidateDeferred;
        var createCandidateDeferred;

        beforeEach(angular.mock.module('tdprRecruiterModule'));

        beforeEach(inject(function ($controller, _$q_, _$rootScope_) {
                $scope = _$rootScope_.$new();
                Notification = jasmine.createSpyObj('Notification', ['success', 'error']);

                tdprCandidatesService = jasmine.createSpyObj('tdprCandidateService', ['deleteCandidate', 'createCandidate']);
                deleteCandidateDeferred = _$q_.defer();
                tdprCandidatesService.deleteCandidate.and.returnValue(deleteCandidateDeferred.promise);

                createCandidateDeferred = _$q_.defer();
                tdprCandidatesService.createCandidate.and.returnValue(createCandidateDeferred.promise);

                candidates = [
                    {
                        "id" : 1,
                        "firstName" : "Jan",
                        "lastName" : "Gruszka"
                    },
                    {
                        "id" : 2,
                        "firstName" : "Ania",
                        "lastName" : "Gruszka"
                    },
                    {
                        "id" : 3,
                        "firstName" : "Michał",
                        "lastName" : "Gruszka"
                    }
                ];

                candidate = {
                    "id" : 1,
                    "firstName" : "Jan",
                    "lastName" : "Gruszka"
                }

                ngDialog = {};

                $controller("tdprCandidatesController", {
                    $scope : $scope,
                    tdprCandidatesService : tdprCandidatesService,
                    candidates : candidates,
                    ngDialog : ngDialog,
                    $timeout : {},
                    Notification : Notification
                });
            })
        );

        describe('When click delete button', function () {
            it('should delete candidate.',function(){
                deleteCandidateDeferred.resolve({"data" : 1});
                $scope.removeCandidate(candidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith({message: 'Deleting candidate succeed', delay: 2000});
                expect($scope.candidates.length).toEqual(2);
            });

            it("should notificate an error and do not remove candidate when sth is wrong", function(){
                var message = 'Deleting failed.';
                deleteCandidateDeferred.reject({message : message});
                $scope.removeCandidate(candidate);
                $scope.$apply();
                expect(Notification.error).toHaveBeenCalledWith({message : message, delay: 3500});
                expect($scope.candidates.length).toEqual(3);
            })
        });

        describe('When click add candidate button', function(){
            it('should add candidate if data is complete', function(){
                var message = 'Create candidate.';
                createCandidateDeferred.resolve();
                $scope.create(candidate);
                $scope.$apply();
                expect(Notification.success).toHaveBeenCalledWith({message : message, delay: 2000});
                expect($scope.candidates.length).toEqual(4);
            })
        })
    })
});
