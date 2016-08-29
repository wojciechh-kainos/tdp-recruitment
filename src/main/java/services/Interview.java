package services;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import domain.Candidate;
import domain.Person;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.*;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Interview {

    private List<Person> interviewers = new ArrayList<>();
    private Person organizer;
    private Date start;
    private Date end;
    private Candidate interviewee;
    private String room;
    private String message;
    private static final Logger logger = LoggerFactory.getLogger(Interview.class);

    public Interview() {
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public void setInterviewers(List<Person> interviewers) {
        this.interviewers = interviewers;
    }

    public void setOrganizer(Person organizer) {
        this.organizer = organizer;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public void setInterviewee(Candidate interviewee) {
        this.interviewee = interviewee;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private MimeMultipart createInvitation() throws MessagingException {
        MimeMultipart body = new MimeMultipart("alternative");
        BodyPart textContent = new MimeBodyPart();
        BodyPart calendarPart = new MimeBodyPart();

        if(message != null) {
            textContent.setContent(message, "text/plain; charset=utf-8");
            body.addBodyPart(textContent);
        }

        calendarPart.setContent(createCalendarEvent(), "text/calendar;method=REQUEST");
        calendarPart.addHeader("Content-Class", "urn:content-classes:calendarmessage");
        body.addBodyPart(calendarPart);


        return body;
    }

    private String createCalendarEvent() {
        String template = "";
        UUID eventUUID = UUID.randomUUID(); //should this be random?
        SimpleDateFormat iCalDate = new SimpleDateFormat("yyyyMMdd'T'HHmm'00Z'");
        String now = iCalDate.format(new Date());
        iCalDate.setTimeZone(TimeZone.getTimeZone("UTC"));

        URL url = Resources.getResource("email/event_template.ics");
        try {
            template = Resources.toString(url, Charsets.UTF_8);
        } catch (IOException e) {
            logger.warn("Error creating calendar event => {}", e.getMessage());
        }

        return template.replace("{{organizer}}", parseOrganizer())
                .replace("{{attendees}}", parseAttendees())
                .replace("{{summary}}", parseSubject())
                .replace("{{room}}", room != null ? room : "")
                .replace("{{dtstart}}", iCalDate.format(start))
                .replace("{{dtend}}", iCalDate.format(end))
                .replace("{{uid}}", eventUUID.toString())
                .replace("{{dtstamp}}", now);
    }

    private String parseSubject(){
        if (interviewee == null) {
            return "Interview";
        }

        String template = "Interview - {{fname}} {{lname}} ({{position}})";
        return template.replace("{{fname}}", interviewee.getFirstName())
                .replace("{{lname}}", interviewee.getLastName())
                .replace("{{position}}", interviewee.getPosition());
    }

    private String parseOrganizer() {
        String organizerTemplate = "ORGANIZER;CN={{fname}} {{lname}}:MAILTO:{{mail}}\n";

        return organizerTemplate
                .replace("{{fname}}", organizer.getFirstName())
                .replace("{{lname}}", organizer.getLastName())
                .replace("{{mail}}", organizer.getEmail());
    }

    private String parseAttendees() {
        String result = "";
        String attendeeTemplate = "ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN={{fname}} {{lname}}:MAILTO:{{mail}}\n";
        for (Person interviewer : interviewers) {
            result += attendeeTemplate
                    .replace("{{fname}}", interviewer.getFirstName())
                    .replace("{{lname}}", interviewer.getLastName())
                    .replace("{{mail}}", interviewer.getEmail());
        }
        return result;
    }

    public MimeMessage createMessage() throws MessagingException {
        Session session = Session.getDefaultInstance(new Properties());
        MimeMessage message = new MimeMessage(session);

        message.setSubject(parseSubject());
        message.setSentDate(new Date());
        message.setFrom(new InternetAddress(organizer.getEmail()));
        for (Person interviewer : interviewers) {
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(interviewer.getEmail()));
        }
        message.setContent(createInvitation());

        return message;
    }

}
