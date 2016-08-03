define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('personsService', function ($http) {
        var persons;
        
        this.fetchPersons = function(){
            $http.get().then(
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