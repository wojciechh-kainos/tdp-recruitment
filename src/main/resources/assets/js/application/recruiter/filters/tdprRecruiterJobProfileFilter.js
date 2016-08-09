define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.filter('jobProfileFilter', function(){
        return function(person, jobProfile){
             var response = [];

             for(var i = 0; i < person.length; i++){
                 switch(jobProfile){
                    case 'isDev': {
                        if(person[i].isDev == true)
                            response.push(person[i]);
                            break;
                    }
                    case 'isOps': {
                        if(person[i].isOps == true)
                            response.push(person[i]);
                            break;
                    }
                    case 'isTest': {
                        if(person[i].isTest == true)
                            response.push(person[i]);
                            break;
                    }
                 }
             }

             return response;
        }
    });
})