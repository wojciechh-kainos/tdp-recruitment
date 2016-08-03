define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/directives/tdprAvailabilityDirective'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprPersonsDirective'
    , 'application/recruiter/directives/tdprTableDirective'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope) {

        // TODO: To be filled by service
        $scope.staticData =         {
            "slots_times":
            {
                "19": {
                    "id": 19,
                    "start": "07:30:00",
                    "end": "08:00:00"
                },
                "1": {
                    "id": 1,
                    "start": "08:00:00",
                    "end": "08:30:00"
                },
                "2": {
                    "id": 2,
                    "start": "08:30:00",
                    "end": "09:00:00"
                },
                "3": {
                    "id": 3,
                    "start": "09:00:00",
                    "end": "09:30:00"
                },
                "4": {
                    "id": 4,
                    "start": "09:30:00",
                    "end": "10:00:00"
                },
                "5": {
                    "id": 5,
                    "start": "10:00:00",
                    "end": "10:30:00"
                },
                "6": {
                    "id": 6,
                    "start": "10:30:00",
                    "end": "11:00:00"
                },
                "7": {
                    "id": 7,
                    "start": "11:00:00",
                    "end": "11:30:00"
                },
                "8": {
                    "id": 8,
                    "start": "11:30:00",
                    "end": "12:00:00"
                },
                "9": {
                    "id": 9,
                    "start": "12:00:00",
                    "end": "12:30:00"
                },
                "10": {
                    "id": 10,
                    "start": "12:30:00",
                    "end": "13:00:00"
                },
                "11": {
                    "id": 11,
                    "start": "13:00:00",
                    "end": "13:30:00"
                },
                "12": {
                    "id": 12,
                    "start": "13:30:00",
                    "end": "14:00:00"
                },
                "13": {
                    "id": 13,
                    "start": "14:00:00",
                    "end": "14:30:00"
                },
                "14": {
                    "id": 14,
                    "start": "14:30:00",
                    "end": "15:00:00"
                },
                "15": {
                    "id": 15,
                    "start": "15:00:00",
                    "end": "15:30:00"
                },
                "16": {
                    "id": 16,
                    "start": "15:30:00",
                    "end": "16:00:00"
                },
                "17": {
                    "id": 17,
                    "start": "16:00:00",
                    "end": "16:30:00"
                },
                "18": {
                    "id": 18,
                    "start": "16:30:00",
                    "end": "17:00:00"
                }
            },
            "persons": [
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

            ]
        }
        ;

        $scope.startDateWeek = new Date("2016-08-01");
    })
});
