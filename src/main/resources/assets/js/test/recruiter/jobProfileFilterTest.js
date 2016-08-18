define(['angular', 'angularMocks', 'application/recruiter/filters/tdprRecruiterJobProfileFilter', 'application/recruiter/tdprRecruiterModule'], function (angular) {
    describe('tdprRecruiterJobProfileFilter', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var filter;

        var personDataForTesting = [
            {
                "email": "kuba@kuba",
                "isDev": true,
                "isOps": false,
                "isTest": false
            },
            {
                "email": "kuba2@kuba",
                "isDev": true,
                "isOps": false,
                "isTest": true
            }
        ];

        beforeEach(inject(function (_$filter_) {
            filter = _$filter_;
        }));

        describe('test job profile filter', function () {
            it("should return 2 persons when isDev marked", function () {
                expect(filter('jobProfileFilter')(personDataForTesting, 'isDev').length).toEqual(2);
            });

            it("should return one person when isTest marked", function () {
                expect(filter('jobProfileFilter')(personDataForTesting, 'isTest').length).toEqual(1);
            });

            it("should return nothing when isOps marked", function () {
                expect(filter('jobProfileFilter')(personDataForTesting, 'isOps').length).toEqual(0);
            });

            it("should return 2 persons when job profile value not set", function () {
                expect(filter('jobProfileFilter')(personDataForTesting).length).toEqual(2);
            });

            it("should return 2 persons when job profile value is empty string", function () {
                expect(filter('jobProfileFilter')(personDataForTesting, '').length).toEqual(2);
            })
        })
    })
});
