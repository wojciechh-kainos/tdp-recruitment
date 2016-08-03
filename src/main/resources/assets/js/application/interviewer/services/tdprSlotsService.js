define(['angular', 'js/application/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdpInvestModule.service("tdprSlotsService", function($http) {

        this.getSlots = function(startDate, endDate, personId) {
            return $http.get("/api/slots?" + "personId" + personId + "startDate=" + startDate + "&endDate=" + endDate);
        };

        this.updateSlots = function(slots, personId, startDate, endDate){
            return $http.put("/api/slots/update/" + personId +"/" + startDate + "/" + endDate, slots);
        };
    })
});