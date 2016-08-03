define(['angular'
    , 'application/tdprModule'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/controllers/tdprWeekTableController'
], function (angular, module) {
    module.config(function ($stateProvider) {
        $stateProvider.
            state("recruiter", {
            url: "/recruiter",
            templateUrl: "js/application/recruiter/views/tdpr-table.html",
            controller: "tdprWeekTableController"
        });
    });

    return module;
});
