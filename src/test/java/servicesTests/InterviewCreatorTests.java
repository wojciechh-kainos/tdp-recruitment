package servicesTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import configuration.TdpRecruitmentEmailConfiguration;
import io.dropwizard.jackson.Jackson;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import services.Interview;
import services.MailingTask;

import javax.mail.Message;
import javax.mail.MessagingException;
import java.io.IOException;

import static io.dropwizard.testing.FixtureHelpers.fixture;
import static org.junit.Assert.assertTrue;

public class InterviewCreatorTests {    // TODO: implement test cases

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();
    private static TdpRecruitmentEmailConfiguration emailConfiguration;

    private Interview mockInterview;

    @BeforeClass
    public static void init() {
        emailConfiguration = new TdpRecruitmentEmailConfiguration();
        emailConfiguration.setHost("mail.kainos.com");
        emailConfiguration.setPort(25);
        emailConfiguration.setFrom("no-reply@kainos.com");
    }

    @Before
    public void setUp() throws IOException {
        mockInterview = MAPPER.readValue(fixture("fixtures/interview.json"),
                MAPPER.getTypeFactory().constructType(Interview.class));
    }

    @Test
    public void createCalendarEventTest() {
        mockInterview.createCalendarEvent();
        assertTrue(true);
    }

    @Test
    public void createInvitationTest() throws MessagingException {
        mockInterview.createInvitation();
        assertTrue(true);
    }

    @Test
    public void createMessageTest() throws MessagingException {
        mockInterview.createMessage();
        assertTrue(true);
    }

    @Test
    public void sendMessageTest() throws InterruptedException, MessagingException {
        Message message = mockInterview.createMessage();
        MailingTask mailingTask = new MailingTask(emailConfiguration, message);

        mailingTask.run();
        assertTrue(true);
    }

}
