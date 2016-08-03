define(['angular'
    , 'application/tdprModule'
], function(angular, module) {
    module.config(function($stateProvider) {
        $stateProvider
            .state("base", {
                abstract: true,
                url: "/"
            });

    });

    return module;
});