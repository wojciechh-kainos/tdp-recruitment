define(['angular', 'angularMocks'
    , 'lodash'
    , 'application/common/filters/tdprJobProfileFilter'
    , 'application/common/tdprCommonModule'], function (angular) {
    describe('tdprReportFilters', function () {
        beforeEach(angular.mock.module('tdprCommonModule'));

        var filter;

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

        beforeEach(inject(function (_$filter_) {
            filter = _$filter_;
        }));

        describe('By job profile filter', function () {
            it('should return 1 person if isDev checked, object filter', function () {
                var selected = {
                    isDev: true,
                    isTest: false,
                    isWeb: false
                };

                expect(filter('jobReportProfileFilter')(dataForTesting, selected).length).toEqual(1);
            });

            it('should return 1 person if isDev checked, string filter', function () {
                expect(filter('jobReportProfileFilter')(dataForTesting, "isDev").length).toEqual(1);
            });

            it('should return 1 person if isDev checked, string filter', function () {
                expect(filter('jobReportProfileFilter')(dataForTesting, "isDev").length).toEqual(1);
            });

            it('should return 2 person if isDev and isWeb checked, object filter', function () {
                var selected = {
                    isDev: true,
                    isTest: false,
                    isWeb: true
                };

                expect(filter('jobReportProfileFilter')(dataForTesting, selected).length).toEqual(2);
            });
        })
    })
});
