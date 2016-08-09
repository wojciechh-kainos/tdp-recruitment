define(['application/recruiter/tdprRecruiterModule'], function (tdprRecruiterModule) {
    tdprRecruiterModule.filter('jobProfileFilter', function(){
        return function(person, isDev, isOps, isTest){
             var response = [];

             for(var i = 0; i < person.length; i++){
                 if(isDev && person[i].isDev){
                     response.push(person[i]);
                     continue;
                 }
                 if(isOps && person[i].isOps){
                     response.push(person[i]);
                     continue;
                 }
                 if(isTest && person[i].isTest){
                     response.push(person[i]);
                     continue;
                 }
             }

             return response;
        }
    });
})