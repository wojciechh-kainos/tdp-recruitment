define(['angular', 'application/common/tdprCommonModule'], function (angular, tdprCommonModule) {
    tdprCommonModule.service('tdprUsefulFunctions', function () {

        this.isUndefinedOrNull = function (variable) {
            return angular.isUndefined(variable) || variable === null
        }

    })
});
