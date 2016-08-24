'use strict';

//noinspection JSFileReferences
require.config({
    baseUrl: 'js/',
    paths: {
        'angular': 'lib/angular/angular',
        'uiRouter': 'lib/angular-ui-router/release/angular-ui-router.min',
        'ui-bootstrap': 'lib/angular-bootstrap/ui-bootstrap-tpls',
        'lodash': 'lib/lodash/lodash',
        'notification': 'lib/angular-ui-notification/dist/angular-ui-notification',
        'moment' : 'lib/moment/moment',
        'angular-moment' : 'lib/angular-moment/angular-moment',
        'ngCookies': 'lib/angular-cookies/angular-cookies',
        'angularFileSaver' : 'lib/angular-file-saver/dist/angular-file-saver',
        'fileSaver' : 'lib/file-saver.js/FileSaver',
        'blob' : 'lib/blob-polyfill/Blob'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'lodash':  {
            exports: '_'
        },
        'ui-bootstrap': ['angular'],
        'uiRouter': ['angular'],
        'notification': ['angular'],
        'moment' : ['angular'],
        'angular-moment' : ['angular', 'moment'],
        'ngCookies': {
            exports: 'ngCookies',
            deps: ['angular']
        },
        'fileSaver' : ['angular'],
        'blob' : ['angular', 'fileSaver'],
        'angularFileSaver' : ['angular', 'fileSaver', 'blob']
    },
    deps: ['application/bootstrap']
});
