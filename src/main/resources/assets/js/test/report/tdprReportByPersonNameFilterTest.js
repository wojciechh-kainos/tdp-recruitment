define(['angular', 'angularMocks','application/report/filters/tdprReportByPersonNameFilter', 'application/report/tdprReportModule'], function (angular) {
    describe('tdprReportByPersonNameFilter', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var filter;

        var dataForTesting = [
            {
                person : {
                    firstName : "Jakub",
                    lastName : "Raniszewski"
                }
            },
            {
                person : {
                    firstName : "Jan",
                    lastName : "Nowak"
                }
            }
        ];

        beforeEach(inject(function (_$filter_) {
            filter = _$filter_;
        }));

        describe('When phrase fill', function () {
            it('should return 1 report', function(){
                expect(filter('personNameFilter')(dataForTesting, 'Jan').length).toEqual(1);
            });

            it('should return 2 reports', function(){
                expect(filter('personNameFilter')(dataForTesting, 'Ja').length).toEqual(2);
            });

            it('should return 1 reports', function(){
                expect(filter('personNameFilter')(dataForTesting, 'Rani').length).toEqual(1);
            });

            it('should return 1 reports', function(){
                expect(filter('personNameFilter')(dataForTesting, 'Jakub Raniszewski').length).toEqual(1);
            });

            it('should return 1 reports', function(){
                expect(filter('personNameFilter')(dataForTesting, 'Nowak Jan').length).toEqual(1);
            });
        });

        describe('When phrase not fill', function(){
            it('should return 2 reports', function(){
                expect(filter('personNameFilter')(dataForTesting, '').length).toEqual(2);
            })

            it('should return 2 reports', function(){
                expect(filter('personNameFilter')(dataForTesting).length).toEqual(2);
            })

            it('should return 0 persons', function(){
                expect(filter('personNameFilter')(dataForTesting, 'Alicja').length).toEqual(0);
            })
        });
    })
});
