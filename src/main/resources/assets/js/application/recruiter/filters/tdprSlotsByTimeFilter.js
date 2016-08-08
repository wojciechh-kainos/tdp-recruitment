define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {

    tdprRecruiterModule.filter('slotsByTime', function() {

        return function(input, startTime, endTime) {
            var filteredInput = [];
            input.forEach(function(el) {
                if (el.startTime >= startTime && el.endTime <= endTime) {
                    filteredInput.push(el);
                }
            });

            return filteredInput;

        }
    })


});