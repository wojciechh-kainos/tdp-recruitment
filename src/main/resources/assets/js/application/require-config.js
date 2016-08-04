'use strict';

//noinspection JSFileReferences
require.config({
    baseUrl: 'js/',
    paths: {
        'angular': 'lib/angular/angular',
        'uiRouter': 'lib/angular-ui-router/release/angular-ui-router.min',
        'ui-bootstrap': 'lib/angular-bootstrap/ui-bootstrap-tpls'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ui-bootstrap': ['angular'],
        'uiRouter': ['angular']
    },
    deps: ['application/bootstrap']
});
