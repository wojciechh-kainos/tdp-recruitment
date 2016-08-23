define(['application/report/tdprReportModule'], function (tdprReportModule) {
    tdprReportModule.service('tdprReportService', ['$http', '$q', 'dateFilter', 'DateFormat', function ($http, $q, dateFilter, DateFormat) {

        this.getReports = function (dateFrom, dateTo) {
            return $http.get('/api/report/' + dateFilter(dateFrom, DateFormat) + '/' + dateFilter(dateTo, DateFormat))
                .then(
                    function (response) {
                         return response.data.map(sumOfHours);
                    },
                    function (error) {
                        error.message = "Unable to get data from server!";
                        return $q.reject(error.message)
                    })
        };

        var sumOfHours = function(item){
            item.sumOfHours = item.initHours + item.fullHours;
            return item;
        }
    }])
});
