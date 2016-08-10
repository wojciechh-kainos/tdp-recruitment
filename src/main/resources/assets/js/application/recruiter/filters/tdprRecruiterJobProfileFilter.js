define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.filter('jobProfileFilter', function(){
        return function(persons, jobProfile){
             var response = [];

             if(jobProfile == undefined || jobProfile == ""){
                return persons;
             }

             for(var i = 0; i < persons.length; i++){
                 switch(jobProfile){
                    case 'isDev': {
                        if(persons[i].isDev == true)
                            response.push(persons[i]);
                            break;
                    }
                    case 'isOps': {
                        if(persons[i].isOps == true)
                            response.push(persons[i]);
                            break;
                    }
                    case 'isTest': {
                        if(persons[i].isTest == true)
                            response.push(persons[i]);
                            break;
                    }
                 }
             }

             return response;
        }
    });
})