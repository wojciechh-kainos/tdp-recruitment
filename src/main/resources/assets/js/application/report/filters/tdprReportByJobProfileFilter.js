define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.filter('jobProfileFilter', function(){
        return function(reports, jobProfile){
             if(jobProfile == undefined || jobProfile == ""){
                return reports;
             }

            return reports.filter(function(report){
                return report.person[jobProfile];
            });
        }
    });
})