define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('personsService', function ($http) {
        var persons;
        
        this.fetchPersons = function(){
            var conf = {
                params: {
                    dateStart: '2010-01-11',
                    dateEnd: '2012-02-11'
                }
            };
            return $http.get('/api', conf).then(
                function (response) {
                    persons = response.data;
                },
                function (error) {
                    console.log(error);
                }
            )
        };

        this.getPersons = function () {
            return persons;
        }
    })
});