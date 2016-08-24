package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import domain.Person;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.*;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

public class Interview {

    private List<Person> interviewers = new ArrayList<>();
    private Person organizer;
    private Date start;
    private Date end;
    private String interviewee;

    public Interview() {

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

    public void setInterviewee(String interviewee) {
        this.interviewee = interviewee;
    }

    public MimeMultipart createInvitation() throws MessagingException {
        MimeMultipart body = new MimeMultipart("alternative");
        BodyPart textContent = new MimeBodyPart();
        BodyPart calendarPart = new MimeBodyPart();

        textContent.setContent("Text", "text/plain; charset=utf-8");
        calendarPart.setContent(createCalendarEvent(), "text/calendar;method=REQUEST");
        calendarPart.addHeader("Content-Class", "urn:content-classes:calendarmessage");

        body.addBodyPart(textContent);
        body.addBodyPart(calendarPart);

        return body;
    }

    public String createCalendarEvent() {
        String template = "";

        SimpleDateFormat iCalDate = new SimpleDateFormat("yyyyMMdd'T'HHmm'00'");
        String now = iCalDate.format(new Date());
        iCalDate.setTimeZone(TimeZone.getTimeZone("UTC"));

        URL url = Resources.getResource("email/event_template.ics");
        try {
            template = Resources.toString(url, Charsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return template.replace("{{organizer}}", parseOrganizer())  //TODO replace room field
                .replace("{{attendees}}", parseAttendees())
                .replace("{{dtstart}}", iCalDate.format(start))
                .replace("{{dtend}}", iCalDate.format(end))
                .replace("{{dtstamp}}", now);
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

        message.setSubject("Interview");
        message.setSentDate(new Date());
        message.setFrom(new InternetAddress(organizer.getEmail()));
        for (Person interviewer : interviewers) {
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(interviewer.getEmail()));
        }
        message.setContent(createInvitation());

        return message;
    }

}
