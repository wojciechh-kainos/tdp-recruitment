define(['angular', 'application/common/tdprCommonModule'], function (angular, tdprCommonModule) {
    tdprCommonModule.directive("newPassword", function () {
        return {
            restrict: 'AE',
            templateUrl: '/html/partials/common/tdpr-directive-new-password.html',
            scope: {
                arePasswordsCorrect: '=',
                password: '='
            },
            link: function (scope) {
                scope.arePasswordsDifferent = false;
                scope.isPasswordValid = true;
                scope.password = '';
                scope.confirmPassword = '';

                scope.$watch('[password, confirmPassword]', function (newValue, oldValue, scope) {
                    scope.arePasswordsDifferent = newValue[0] !== newValue[1];
                    scope.isPasswordValid = isPasswordValid(newValue[0]);
                    scope.arePasswordsCorrect = scope.isPasswordValid && !scope.arePasswordsDifferent;
                });

                function isPasswordValid(password) {
                    var clues = [];
                    if (password.length < 8) {
                        clues.push("8 characters");
                    }
                    if (password.search(/[a-z]/) < 0) {
                        clues.push("one lowercase letter.");
                    }
                    if (password.search(/[A-Z]/) < 0) {
                        clues.push("one uppercase letter.");
                    }
                    if (password.search(/[0-9]/) < 0) {
                        clues.push("one digit.");
                    }
                    if (password.search(/[!@#$%^&*]/) < 0) {
                        clues.push("one special character.");
                    }
                    scope.passwordClues = clues;
                    if (clues.length > 0) {
                        return false;
                    }
                    return true;
                }
            }
        }

    });
});
