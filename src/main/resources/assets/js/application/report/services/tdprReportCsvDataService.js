define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.service('tdprReportCsvDataService', function () {

        var baseLink = "data:text/csv;charset=utf-8,";
        var separator = ';';
        var endOfLine = "\n";
        var quote = '"';
        var emptySpace = " ";

        this.generateCsvData = function(viewReportData, columnMap){
            var reportData = JSON.parse(JSON.stringify(viewReportData));
            var dataString = createHeader(columnMap);

            reportData.map(function(item){
                item.initHours = item.initHours.toString().replace(".", ",");
                item.fullHours = item.fullHours.toString().replace(".", ",");
                item.availableHours = item.availableHours.toString().replace(".", ",");
                return item;
            });

            reportData.forEach(function(item){
               dataString += createReportRow(item);
            });

            return dataString;
        }

        this.getLink = function(dataString){
            return baseLink + encodeURIComponent(dataString);
        }

        var createHeader = function(columnMap){
            var header = addQuotes(columnMap["person.lastName"].columnName) + separator;
            header += addQuotes(columnMap["initHours"].columnName) + separator;
            header += addQuotes(columnMap["fullHours"].columnName) + separator;
            header += addQuotes(columnMap["availableHours"].columnName) + endOfLine;
            return header;
        }

        var createReportRow = function(reportElement){
            var row = addQuotes(reportElement.person.lastName + emptySpace + reportElement.person.firstName) + separator;
            row += addQuotes(reportElement.initHours) + separator;
            row += addQuotes(reportElement.fullHours) + separator;
            row += addQuotes(reportElement.availableHours) + endOfLine;
            return row;
        }

        var addQuotes = function(element){
            return quote + element + quote;
        }

    });
});
