define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/directives/tdprAvailabilityDirective'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'
    , 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprRecruiterGetSlotsTimesService) {
        var slotsData = tdprRecruiterGetSlotsTimesService.getSlotsTimes();
        var timeData = {};

        $scope.staticData = [];
        $scope.timeData = {};

        slotsData.then(function () {
            timeData = tdprRecruiterGetSlotsTimesService.getSlots();

            console.log(timeData);

            $scope.timeData = timeData;

            // TODO: To be filled by service
            $scope.staticData = [
                {
                    "id": 1,
                    "first_name": "Jan",
                    "last_name": "Nowak",
                    "name": "Jan Nowak",
                    "email": "j.nowak@kainos.com",
                    "is_dev": true,
                    "is_test": false,
                    "is_ops": false,
                    "band_level": 2,
                    "slots": [
                        {
                            "id": 1,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 1,
                            "type": "available"
                        },
                        {
                            "id": 2,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 2,
                            "type": "available"
                        },
                        {
                            "id": 3,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 3,
                            "type": "available"
                        },
                        {
                            "id": 4,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 6,
                            "type": "available"
                        },
                        {
                            "id": 5,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 5,
                            "type": "available"
                        },
                        {
                            "id": 6,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 7,
                            "type": "available"
                        },
                        {
                            "id": 7,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 8,
                            "type": "full"
                        },
                        {
                            "id": 8,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 9,
                            "type": "full"
                        },
                        {
                            "id": 9,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 10,
                            "type": "full"
                        }
                    ],
                    "children": []
                },
                {
                    "id": 2,
                    "first_name": "Jan",
                    "last_name": "Nowak",
                    "name": "Jan Nowak",
                    "email": "j.nowak@kainos.com",
                    "is_dev": true,
                    "is_test": false,
                    "is_ops": false,
                    "band_level": 2,
                    "slots": [
                        {
                            "id": 1,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 1,
                            "type": "available"
                        },
                        {
                            "id": 2,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 2,
                            "type": "available"
                        },
                        {
                            "id": 3,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 3,
                            "type": "available"
                        },
                        {
                            "id": 4,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 6,
                            "type": "available"
                        },
                        {
                            "id": 5,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 5,
                            "type": "available"
                        },
                        {
                            "id": 6,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 7,
                            "type": "available"
                        },
                        {
                            "id": 7,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 8,
                            "type": "full"
                        },
                        {
                            "id": 8,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 9,
                            "type": "full"
                        },
                        {
                            "id": 9,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 10,
                            "type": "full"
                        }
                    ],
                    "children": []
                },
                {
                    "id": 3,
                    "first_name": "Jan",
                    "last_name": "Nowak",
                    "name": "Jan Nowak",
                    "email": "j.nowak@kainos.com",
                    "is_dev": true,
                    "is_test": false,
                    "is_ops": false,
                    "band_level": 2,
                    "slots": [
                        {
                            "id": 1,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 1,
                            "type": "available"
                        },
                        {
                            "id": 2,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 2,
                            "type": "available"
                        },
                        {
                            "id": 3,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 3,
                            "type": "available"
                        },
                        {
                            "id": 4,
                            "day": "2016-08-01",
                            "person": 2,
                            "slot": 6,
                            "type": "available"
                        },
                        {
                            "id": 5,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 5,
                            "type": "available"
                        },
                        {
                            "id": 6,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 7,
                            "type": "available"
                        },
                        {
                            "id": 7,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 8,
                            "type": "full"
                        },
                        {
                            "id": 8,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 9,
                            "type": "full"
                        },
                        {
                            "id": 9,
                            "day": "2016-08-02",
                            "person": 2,
                            "slot": 10,
                            "type": "full"
                        }
                    ],
                    "children": []
                }
            ];

            console.log($scope.staticData);
            console.log($scope.timeData);
        });


        $scope.startDateWeek = new Date("2016-08-01");
    })
});
