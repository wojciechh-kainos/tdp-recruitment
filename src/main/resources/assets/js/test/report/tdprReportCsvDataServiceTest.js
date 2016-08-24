define(['angular', 'angularMocks', 'application/report/services/tdprReportCsvDataService'], function (angular) {

    describe('tdprReportCsvDataService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $service;
        var reports = [
            {
                initHours : 20.5,
                fullHours : 20,
                sumOfHours : 20.4,
                person : {
                    lastName : "FirstLastName",
                    firstName : "FirstFirstName"
                }

            },
            {
                initHours : 0,
                fullHours : 10,
                sumOfHours : 2.4,
                person : {
                    lastName : "SecondLastName",
                    firstName : "SecondFirstName"
                }
            }
        ]

        var startDate = '2016-08-15';
        var endDate = '2016-08-21';

        var columnMap = {
            'person.lastName': {reverse: true, columnName: "Person"},
            'initHours': {reverse: true, columnName: "Init hours"},
            'fullHours': {reverse: true, columnName: "Full hours"},
            'sumOfHours': {reverse: true, columnName: "Sum of hours"}
        };

        var expectedString = '"Start Date:";"' + startDate + '";"End Date:";"' + endDate + '"\n'
            + ';;;\n'
            + '"Person";"Init hours";"Full hours";"Sum of hours"\n'
            + '"FirstLastName FirstFirstName";"20,5";"20";"20,4"\n'
            + '"SecondLastName SecondFirstName";"0";"10";"2,4"\n';

        var expectedEmptyString = '"Start Date:";"' + startDate + '";"End Date:";"' + endDate + '"\n'
            + ';;;\n'
            + '"Person";"Init hours";"Full hours";"Sum of hours"\n'

        var expectedLink = "data:text/csv;charset=utf-8,";

        beforeEach(inject(function (_tdprReportCsvDataService_) {
            $service = _tdprReportCsvDataService_;
        }));

        describe('When generating csv string value', function(){
            it('should return expected string', function(){
                var dataString = $service.generateCsvData(startDate, endDate, reports, columnMap);
                expect(dataString).toEqual(expectedString);
            });

            it('should return expected empty string', function(){
                var dataString = $service.generateCsvData(startDate, endDate, [], columnMap);
                expect(dataString).toEqual(expectedEmptyString);
            });

            it('should return expected link', function(){
                var link = $service.getLink(expectedString);
                expect(link).toContain(expectedLink);
            });

        })
    })
});
