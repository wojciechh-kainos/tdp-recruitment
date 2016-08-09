define(['angular', 'angularMocks','application/recruiter/filters/tdprRecruiterJobProfileFilter', 'application/recruiter/tdprRecruiterModule'], function (angular) {
    describe('tdprRecruiterJobProfileFilter', function () {
        beforeEach(angular.mock.module('tdprRecruiterModule'));

        var filter;

        var personDataForTesting = [
            {
                "email" : "kuba@kuba",
                "isDev" : true,
                "isOps" : false,
                "isTest" : false
            },
            {
                "email" : "kuba2@kuba",
                "isDev" : true,
                "isOps" : false,
                "isTest" : true
            }
        ]

        beforeEach(inject(function (_$filter_) {
            filter = _$filter_;
        }));

        describe('test job profile filter', function () {
            it("should return two person when isDev marked", function(){
                isDev = true;
                isOps= false;
                isTest = false;
                expect(filter('jobProfileFilter')(personDataForTesting, isDev, isOps, isTest).length).toEqual(2);
            })

            it("should return one person when isTest marked", function(){
                isDev = false;
                isOps= false;
                isTest = true;
                expect(filter('jobProfileFilter')(personDataForTesting, isDev, isOps, isTest).length).toEqual(1);
            })

            it("should return nothing when isOps marked", function(){
                isDev = false;
                isOps= true;
                isTest = false;
                expect(filter('jobProfileFilter')(personDataForTesting, isDev, isOps, isTest).length).toEqual(0);
            })
        })
    })
});
