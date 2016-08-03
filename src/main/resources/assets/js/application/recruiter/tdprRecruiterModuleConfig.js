define(['angular'
    , 'application/tdprModule'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/controllers/tdprWeekTableController'
], function (angular, module) {
    module.config(function ($stateProvider) {
        $stateProvider.
            state("recruiter", {
            url: "/recruiter",
            templateUrl: "html/partials/tdpr-table.html",
            controller: "tdprWeekTableController"
        });
    });

    return module;
});
