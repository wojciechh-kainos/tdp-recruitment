define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {

    tdprRecruiterModule.filter('slotsByTime', function() {

        return function(input, startTime, endTime) {
            var filteredInput = [];
            input.forEach(function(el) {
                if ((el.startTime >= startTime || angular.isUndefined(startTime)) && (el.endTime <= endTime || angular.isUndefined(endTime))) {
                    filteredInput.push(el);
                }
            });

            return filteredInput;

        }
    })


});