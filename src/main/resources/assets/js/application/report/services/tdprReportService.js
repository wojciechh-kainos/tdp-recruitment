define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.service('tdprReportService', ['$http', '$q', 'dateFilter', 'DateFormat', function ($http, $q, dateFilter, DateFormat) {

        this.getReport = function (dateFrom, dateTo, personId) {
            return $http.get('/api/report/' + dateFilter(dateFrom, DateFormat) + '/' + dateFilter(dateTo, DateFormat) + '/' + personId)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        error.message = "Unable to get data from server!";
                        return $q.reject(error.message)
                    })
        };

        this.getReports = function (dateFrom, dateTo) {
            return $http.get('/api/report/' + dateFilter(dateFrom, DateFormat) + '/' + dateFilter(dateTo, DateFormat))
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        error.message = "Unable to get data from server!";
                        return $q.reject(error.message)
                    })
        };

    }])
});
