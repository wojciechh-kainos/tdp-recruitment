define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.service('tdprReportCsvDataService', ['FileSaver', function (FileSaver) {

        var baseLink = "text/csv;charset=utf-8,";
        var separator = ';';
        var endOfLine = "\n";
        var quote = '"';
        var emptySpace = " ";

        this.generateCsvData = function (startDate, endDate, viewReportData, columnMap) {
            var reportData = angular.copy(viewReportData);
            var dataString = createInfo(startDate, endDate);
            dataString += createEmptyLine();
            dataString += createHeader(columnMap);

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

        this.getFile = function (startDate, endDate, dataString) {
            var file = new Blob([dataString], { type: baseLink });
            return FileSaver.saveAs(file, createTitle(startDate, endDate));
        };

        var replaceDotWithComma = function (value) {
            return value.toString().replace(".", ",");
        };

        var createTitle = function(startDate, endDate) {
            var title = "Report-" + startDate + "-to-" + endDate + ".csv";
            return title;
        };

        var createEmptyLine = function() {
            return separator + separator + separator + endOfLine;
        };

        var createInfo = function(startDate, endDate) {
            var info = addQuotes("Start Date:") + separator + addQuotes(startDate) + separator + addQuotes("End Date:") + separator + addQuotes(endDate) + endOfLine;
            return info;
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
