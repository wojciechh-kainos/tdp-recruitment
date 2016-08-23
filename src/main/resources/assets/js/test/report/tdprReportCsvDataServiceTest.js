define(['angular', 'angularMocks', 'application/report/services/tdprReportCsvDataService'], function (angular) {

    describe('tdprReportCsvDataService', function () {
        beforeEach(angular.mock.module('tdprReportModule'));

        var $service;
        var reports = [
            {
                initHours : 20.5,
                fullHours : 20,
                availableHours : 20.4,
                person : {
                    lastName : "LastName",
                    firstName : "FirstName"
                }

            }
        ]

        var columnMap = {
            'person.lastName': {reverse: true, columnName: "Person"},
            'initHours': {reverse: true, columnName: "Init hours"},
            'fullHours': {reverse: true, columnName: "Full hours"},
            'availableHours': {reverse: true, columnName: "Unused hours"}
        };

        var expectedString = '"Person";"Init hours";"Full hours";"Unused hours"\n'
            + '"LastName FirstName";"20,5";"20";"20,4"\n';

        var expectedLink = "data:text/csv;charset=utf-8,";


        beforeEach(inject(function (_tdprReportCsvDataService_) {
            $service = _tdprReportCsvDataService_;
        }));

        describe('When generating csv string value', function(){
            it('should return expected string', function(){
                var dataString = $service.generateCsvData(reports, columnMap);
                expect(dataString).toEqual(expectedString);
            });

            it('should return expected link', function(){
                var link = $service.getLink(expectedString);
                expect(link).toContain(expectedLink);
            });
        })
    })
});
