'use strict';

//noinspection JSFileReferences
require.config({
    baseUrl: 'js/',
    paths: {
        'angular': 'lib/angular/angular',
        'uiRouter': 'lib/angular-ui-router/release/angular-ui-router.min',

    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'uiRouter' : ['angular']
    },
    deps: ['application/bootstrap']
});
