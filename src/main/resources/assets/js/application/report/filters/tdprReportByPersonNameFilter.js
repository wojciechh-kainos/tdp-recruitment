define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.filter('personNameFilter', function(){
        return function(reports, phrase){
            if ( phrase === undefined ) {
                return reports;
            }
            var searchPhrase = phrase.toLowerCase();
            return _.filter(reports, function(value){
                var firstName = value.person.firstName.toLowerCase();
                var lastName = value.person.lastName.toLowerCase();

                return _.includes(firstName, searchPhrase) || _.includes(lastName, searchPhrase) || _.includes(firstName + ' ' + lastName, searchPhrase) || _.includes(lastName + ' ' + firstName, searchPhrase);
            })
        }
    });
})
