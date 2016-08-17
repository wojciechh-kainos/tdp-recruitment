define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.service('tdprReportService', ['$http', '$q', 'dateFilter', function ($http, $q, dateFilter) {


        var format = 'dd-MM-yyyy';

        this.getReport = function (dateFrom, dateTo, personId) {
            return $http.get('/api/report/' + dateFilter(dateFrom, format) + '/' + dateFilter(dateTo, format) + '/' + personId)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        error.message = "Unable to get data from server.";
                        return $q.reject(error.message)
                    })
        };

        this.getReports = function (dateFrom, dateTo) {
            return $http.get('/api/report/' + dateFilter(dateFrom, format) + '/' + dateFilter(dateTo, format))
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        error.message = "Unable to get data from server.";
                        return $q.reject(error.message)
                    })
        };
    }]);
});
