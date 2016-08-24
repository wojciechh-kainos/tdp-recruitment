package servicesTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import configuration.TdpRecruitmentApplicationConfiguration;
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
    private final static TdpRecruitmentApplicationConfiguration applicationConfiguration =
            new TdpRecruitmentApplicationConfiguration();

    private Interview mockInterview;

    @BeforeClass
    public static void init() {
        TdpRecruitmentEmailConfiguration conf = new TdpRecruitmentEmailConfiguration();
        conf.setHost("mail.kainos.com");
        conf.setPort(25);
        conf.setFrom("no-reply@kainos.com");
        applicationConfiguration.setSmtpConfig(conf);
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
        MailingTask mailingTask = new MailingTask(applicationConfiguration);

        Message message = mockInterview.createMessage();
        mailingTask.sendMessage(message).run();
        assertTrue(true);
    }

}
