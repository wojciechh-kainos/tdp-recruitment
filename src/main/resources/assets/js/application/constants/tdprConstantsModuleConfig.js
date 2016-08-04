define(['angular'
    , 'application/constants/tdprConstantsModule'
], function (angular, tdprConstantsModule) {

    tdprConstantsModule.constant('AvailabilityEnum', {
        unavailable: {
            priority: 0,
            name: "unavailable",
            className: "cell-avail-unavailable",
            tooltipText: ""
        },
        available: {
            priority: 1,
            name: "available",
            className: "cell-avail-available",
            tooltipText: "available "
        },
        full: {
            priority: 2,
            name: "full",
            className: "cell-avail-full",
            tooltipText: "full "
        },
        init: {
            priority: 3,
            name: "init",
            className: "cell-avail-init",
            tooltipText: "init call"
        }

    });

    return tdprConstantsModule;
});
