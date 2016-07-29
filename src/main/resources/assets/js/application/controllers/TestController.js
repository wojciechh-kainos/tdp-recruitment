define(['angular', 'application/tdpRecruitmentModule'], function(angular, tdpRecruitmentModule) {
    tdpRecruitmentModule.controller("TestController", function($scope,$http) {
        var url = "api/home/sendEmail";
        $scope.sendEmail = function(){$http.get(url).then(function(success){
            $scope.text = "Email Sent";
        },function(failure){
            $scope.text = "failed";
        });
        }
    });
});