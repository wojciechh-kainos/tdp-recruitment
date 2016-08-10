define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.filter('jobProfileFilter', function(){
        return function(persons, jobProfile){
             if(jobProfile == undefined || jobProfile == ""){
                return persons;
             }

            return persons.filter(function(person){
                return person[jobProfile];
            })
        }
    });
})