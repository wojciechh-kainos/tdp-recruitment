define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.service('tdprReportCsvDataService', ['FileSaver', function (FileSaver) {

        var baseLink = "text/csv;charset=utf-8,";
        var separator = ';';
        var endOfLine = "\n";
        var quote = '"';
        var emptySpace = " ";

        this.generateCsvData = function (viewReportData, columnMap) {
            var reportData = angular.copy(viewReportData);
            var dataString = createHeader(columnMap);

            reportData.map(function (reportElement) {
                reportElement.initHours = replaceDotWithComma(reportElement.initHours);
                reportElement.fullHours = replaceDotWithComma(reportElement.fullHours);
                reportElement.sumOfHours = replaceDotWithComma(reportElement.sumOfHours);
                return reportElement;
            });

            reportData.forEach(function (reportElement) {
                dataString += createReportRow(reportElement);
            });

            return dataString;
        };

        this.getFile = function (dataString) {
            var file = new Blob([dataString], { type: baseLink });
            return FileSaver.saveAs(file, 'Report.csv');
        };

        var replaceDotWithComma = function (value) {
            return value.toString().replace(".", ",");
        };

        var createHeader = function (columnMap) {
            var header = addQuotes(columnMap["person.lastName"].columnName) + separator;
            header += addQuotes(columnMap["initHours"].columnName) + separator;
            header += addQuotes(columnMap["fullHours"].columnName) + separator;
            header += addQuotes(columnMap["sumOfHours"].columnName) + endOfLine;
            return header;
        };

        var createReportRow = function (reportElement) {
            var row = addQuotes(reportElement.person.lastName + emptySpace + reportElement.person.firstName) + separator;
            row += addQuotes(reportElement.initHours) + separator;
            row += addQuotes(reportElement.fullHours) + separator;
            row += addQuotes(reportElement.sumOfHours) + endOfLine;
            return row;
        };

        var addQuotes = function (element) {
            return quote + element + quote;
        };

    }]);
});
