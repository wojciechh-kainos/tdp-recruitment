define(['angular', 'application/interviewer/tdprInterviewerModule'], function(angular, tdprInterviewerModule) {
    tdprInterviewerModule.service("tdprSlotsService", function($http) {

        this.getSlots = function(startDate, endDate, personId) {
//            return $http.get("/api/slots/week?" + "id=" + personId + "&startDate=04-01-2010&endDate=09-01-2010");
            return $http.get("/api/slots/week?" + "id=" + personId + "&startDate=" + startDate + "&endDate=" + endDate);
        };

        this.updateSlots = function(slots, personId, startDate, endDate){
            return $http.put("/api/slots/update/" + personId +"/" + startDate + "/" + endDate, slots);
        };
    })
});