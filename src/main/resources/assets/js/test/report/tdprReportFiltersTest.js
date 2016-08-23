define(['angular', 'angularMocks'
    , 'lodash'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/tdprReportModule'], function (angular) {
    describe('tdprReportFilters', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

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

        describe('By person name filter', function () {
            it('should return 1 report', function () {
                expect(filter('personNameFilter')(dataForTesting, 'Jan').length).toEqual(1);
            });

            it('should return 2 reports', function () {
                expect(filter('personNameFilter')(dataForTesting, 'Ja').length).toEqual(2);
            });

            it('should return 1 reports', function () {
                expect(filter('personNameFilter')(dataForTesting, 'Rani').length).toEqual(1);
            });

            it('should return 1 reports', function () {
                expect(filter('personNameFilter')(dataForTesting, 'Jakub Raniszewski').length).toEqual(1);
            });

            it('should return 1 reports', function () {
                expect(filter('personNameFilter')(dataForTesting, 'Nowak Jan').length).toEqual(1);
            });
        });

        describe('By person name filter', function () {
            it('should return 3 reports when phrase empty', function () {
                expect(filter('personNameFilter')(dataForTesting, '').length).toEqual(3);
            });

            it('should return 3 reports when phrase undefined', function () {
                expect(filter('personNameFilter')(dataForTesting).length).toEqual(3);
            });

            it('should return 0 persons when phrase does not fill', function () {
                expect(filter('personNameFilter')(dataForTesting, 'Alicja').length).toEqual(0);
            })
        });

    })
});
