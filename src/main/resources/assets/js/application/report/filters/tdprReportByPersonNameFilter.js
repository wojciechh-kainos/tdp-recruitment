define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.filter('personNameFilter', function(){
        return function(reports, phrase){
            if(phrase === undefined || phrase === ''){
                return reports;
            }
            var words = phrase.split();
            var response = [];
            return _.filter(reports, function(value, key){
                return _.includes(value.person.firstName.toLowerCase(), phrase.toLowerCase()) || _.includes(value.person.lastName.toLowerCase(), phrase.toLowerCase());
            })
        }
    });
})