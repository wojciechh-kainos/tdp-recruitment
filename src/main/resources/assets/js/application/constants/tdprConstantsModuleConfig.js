define(['angular'
    , 'application/constants/tdprConstantsModule'
], function (angular, tdprConstantsModule) {

    tdprConstantsModule.constant('AvailabilityEnum', {
        unavailable: {
            priority: 1,
            name: "unavailable",
            className: "cell-avail-unavailable",
            tooltipText: ""
        },
        available: {
            priority: 2,
            name: "available",
            className: "cell-avail-available",
            tooltipText: "available "
        },
        init: {
            priority: 3,
            name: "init",
            className: "cell-avail-init",
            tooltipText: "init call"
        },
        full: {
            priority: 4,
            name: "full",
            className: "cell-avail-full",
            tooltipText: "full "
        }
    }).constant('JobProfileEnum', {
              dev: "isDev",
              web: "isWeb",
              test: "isTest"
          });

    return tdprConstantsModule;
});
