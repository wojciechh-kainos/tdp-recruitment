'use strict';

//noinspection JSFileReferences
require.config({
    baseUrl: 'js/',
    paths: {
        'angular': 'lib/angular/angular',
        'uiRouter': 'lib/angular-ui-router/release/angular-ui-router.min',
        'ui-bootstrap': 'lib/angular-bootstrap/ui-bootstrap-tpls',
        'notification': 'lib/angular-ui-notification/dist/angular-ui-notification'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ui-bootstrap': ['angular'],
        'uiRouter': ['angular'],
        'notification': ['angular']
    },
    deps: ['application/bootstrap']
});
