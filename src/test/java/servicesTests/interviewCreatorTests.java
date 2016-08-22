package servicesTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.dropwizard.jackson.Jackson;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import services.Interview;

import java.io.IOException;

import static io.dropwizard.testing.FixtureHelpers.fixture;
import static org.junit.Assert.assertTrue;

public class InterviewCreatorTests {

    private static final ObjectMapper MAPPER  = Jackson.newObjectMapper();

    private Interview mockInterview;

    @Before
    public void setUp(){

        try {
            mockInterview = MAPPER.readValue(fixture("fixtures/interview.json"),
                    MAPPER.getTypeFactory().constructType(Interview.class));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void createCalendarEventTest(){
        mockInterview.createCalendarEvent();

        assertTrue(true);
    }

}
