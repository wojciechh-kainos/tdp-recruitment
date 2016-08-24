define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.service('tdprReportCsvDataService', ['FileSaver', function (FileSaver) {

        var contentType = "text/csv;charset=utf-8,";
        var separator = ';';
        var endOfLine = "\n";
        var quote = '"';
        var emptySpace = " ";

        this.generateCsvData = function (startDate, endDate, viewReportData, columnMap) {
            var reportData = angular.copy(viewReportData);

            var dataString = _.join([createInfo(startDate, endDate), createEmptyLine(), createHeader(columnMap)], "");

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
            var file = new Blob([dataString], { type: contentType });
            return FileSaver.saveAs(file, createTitle(startDate, endDate));
        };

        var replaceDotWithComma = function (value) {
            return value.toString().replace(".", ",");
        };

        var createTitle = function(startDate, endDate) {
            var title = _.join(["Report", startDate, "to", endDate], "-");
            title += ".csv";
            return title;
        };

        var createEmptyLine = function() {
            return _.join(["", "", "", endOfLine], separator);
        };

        var createInfo = function(startDate, endDate) {
            var info = _.join([addQuotes("Start Date:"), addQuotes(startDate), addQuotes("End Date:"), addQuotes(endDate)], separator);
            info += endOfLine;
            return info;
        };

        var createHeader = function (columnMap) {
            var header = _.join([addQuotes(columnMap["person.lastName"].columnName),
                addQuotes(columnMap["initHours"].columnName),
                addQuotes(columnMap["fullHours"].columnName),
                addQuotes(columnMap["sumOfHours"].columnName)],
                separator)
            header += endOfLine;
            return header;
        };

        var createReportRow = function (reportElement) {
            var row = _.join([addQuotes(reportElement.person.lastName + emptySpace + reportElement.person.firstName),
                addQuotes(reportElement.initHours),
                addQuotes(reportElement.fullHours),
                addQuotes(reportElement.sumOfHours)], separator);
            row += endOfLine;
            return row;
        };

        var addQuotes = function (element) {
            return quote + element + quote;
        };

    }]);
});
