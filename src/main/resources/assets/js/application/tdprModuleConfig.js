define(['angular'
    , 'application/tdprModule'
], function(angular, module) {
    module.config(function($stateProvider) {
        $stateProvider
            .state("tdpr", {
                abstract: true,
            });

    });

    return module;
});