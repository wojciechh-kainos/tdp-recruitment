define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.filter('personNameFilter', function(){
        return function(reports, phrase){
            var words = str.split(phrase);
            var response = [];
            return _.filter(reports, function(value, key){
                return _.includes(values.person.firstName, phrase) || _.includes(values.person.lastName, phrase);
            })
        }
    });
})