define(['angular'
    , 'application/constants/tdprConstantsModule'
], function (angular, tdprConstantsModule) {

    tdprConstantsModule.constant('AvailabilityEnum', {
        empty: {
            id: '0',
            name: "empty",
            className: "cell-avail-empty",
            tooltipText: ""
        },
        available: {
            id: '1',
            name: "available",
            className: "cell-avail-available",
            tooltipText: "available"
        },
        full: {
            id: '2',
            name: "full",
            className: "cell-avail-full",
            tooltipText: "full"
        },
        init: {
            id: '3',
            name: "init",
            className: "cell-avail-init",
            tooltipText: "init call"
        },
        unavailable: {
            id: '4',
            name: "unavailable",
            className: "cell-avail-unavailable",
            tooltipText: ""
        },
        maybe: {
            id: '5',
            name: "maybe",
            className: "cell-avail-maybe",
            tooltipText: "maybe"
        }
    }).constant('JobProfileEnum', {
        dev: "isDev",
        web: "isWeb",
        test: "isTest"
    }).constant('JobProfileEnumNames', {
        dev: "Developer",
        web: "Web",
        test: "Tester"
    }).constant('BandLevelEnum',{
        "1": "1 - Principal",
        "2": "2 - Manager",
        "3": "3 - Consultant",
        "4": "4 - Senior associate",
        "5": "5 - Associate",
        "6": "6 - Trainee"
    });

    return tdprConstantsModule;
});
