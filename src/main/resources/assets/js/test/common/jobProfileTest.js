define(['angular', 'angularMocks'
    , 'lodash'
    , 'application/common/filters/tdprJobProfileFilter'
    , 'application/common/tdprCommonModule'], function (angular) {
    describe('tdprJobProfileFilters', function () {
        beforeEach(angular.mock.module('tdprCommonModule'));

        var filter;

        // Filtering data for reports
        var dataForTesting = [
            {
                person: {
                    firstName: "Jakub",
                    lastName: "Raniszewski",
                    isDev: true,
                    isTest: true,
                    isWeb: true
                }
            },
            {
                person: {
                    firstName: "Jan",
                    lastName: "Nowak",
                    isDev: false,
                    isTest: false,
                    isWeb: false
                }
            },
            {
                person: {
                    firstName: "Andrzej",
                    lastName: "Kowalski",
                    isDev: false,
                    isTest: false,
                    isWeb: true
                }
            }
        ];

        // Filtering data for recruiter table
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

        describe('By job profile filter, report', function () {
            it('should return 1 person if isDev checked, object filter', function () {
                var selected = {
                    isDev: true,
                    isTest: false,
                    isWeb: false
                };

                expect(filter('jobProfileFilter')(dataForTesting, selected).length).toEqual(1);
            });

            it('should return 1 person if isDev checked, string filter', function () {
                expect(filter('jobProfileFilter')(dataForTesting, "isDev").length).toEqual(1);
            });

            it('should return 1 person if isDev checked, string filter', function () {
                expect(filter('jobProfileFilter')(dataForTesting, "isDev").length).toEqual(1);
            });

            it('should return 2 person if isDev and isWeb checked, object filter', function () {
                var selected = {
                    isDev: true,
                    isTest: false,
                    isWeb: true
                };

                expect(filter('jobProfileFilter')(dataForTesting, selected).length).toEqual(2);
            });
        });

        describe('By job profile filter, table', function () {
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
        });
    })
});
