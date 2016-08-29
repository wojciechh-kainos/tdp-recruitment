package servicesTests;

import domain.Candidate;
import domain.Person;
import org.hamcrest.CoreMatchers;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import services.Interview;

import javax.mail.Address;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class InterviewTest {

    private static Interview interview;
    private static MimeMessage message;

    private static Person organizer;
    private static Person interviewer1;
    private static Person interviewer2;
    private static Candidate interviewee;

    @BeforeClass
    public static void setUp() throws MessagingException {
        interview = new Interview();

        organizer = new Person();
        organizer.setFirstName("Name");
        organizer.setLastName("Surename");
        organizer.setEmail("organizer@example.com");

        interviewee = new Candidate();
        interviewee.setFirstName("Hanna");
        interviewee.setLastName("Wanna");
        interviewee.setPosition("position");

        interviewer1 = new Person();
        interviewer1.setFirstName("Interviewer1");
        interviewer1.setLastName("Interviewer1");
        interviewer1.setEmail("interviewer1@example.com");

        interviewer2 = new Person();
        interviewer2.setFirstName("Interviewer2");
        interviewer2.setLastName("Interviewer2");
        interviewer2.setEmail("interviewer2@example.com");

        List<Person> interviewers = new ArrayList<>();
        interviewers.add(interviewer1);
        interviewers.add(interviewer2);

        Date start = new Date(1410, 15, 11);
        Date end = new Date(1410, 15, 11);

        interview.setInterviewers(interviewers);
        interview.setInterviewee(interviewee);
        interview.setOrganizer(organizer);
        interview.setStart(start);
        interview.setEnd(end);

        message = interview.createMessage();
    }

    @Test
    public void testCreateMessageShouldSetMessageSubject() throws MessagingException {
        assertThat("Should set message subject with name and job position", message.getSubject(),
                allOf(containsString(interviewee.getFirstName()),
                        containsString(interviewee.getLastName()),
                        containsString(interviewee.getPosition())));
    }

    @Test
    public void testCreateMessageShouldSetFromToOrganizer() throws MessagingException {
        Address[] froms = message.getFrom();
        String email = froms == null ? null : ((InternetAddress) froms[0]).getAddress();

        assertEquals("Should set one from", froms.length, 1);
        assertEquals("Should set email from field to organizer's email", email, organizer.getEmail());
    }

    @Test
    public void testCreateMessageShouldSetRecipientsToInterviewers() throws MessagingException {
        Address[] recipients = message.getAllRecipients();
        String email1 = recipients == null ? null : ((InternetAddress) recipients[0]).getAddress();
        String email2 = recipients == null ? null : ((InternetAddress) recipients[1]).getAddress();

        assertEquals("Should set two recipients", recipients.length, 2);
        assertEquals("Should set first recipient to first interviewer email", email1, interviewer1.getEmail());
        assertEquals("Should set second recipient to second interviewer email", email2, interviewer2.getEmail());
    }
}
