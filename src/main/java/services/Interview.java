package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import domain.Persons;
import org.joda.time.DateTime;

import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Interview {

    private List<Persons> interviewers = new ArrayList<Persons>();
    private Persons organizer;
    private Date start;
    private Date end;
    private String interviewee;

    public Interview() {

    }

    public void setInterviewers(List<Persons> interviewers) {
        this.interviewers = interviewers;
    }

    public void setOrganizer(Persons organizer) {
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

        body.addBodyPart(textContent);
        body.addBodyPart(calendarPart);

        return body;
    }

    public String createCalendarEvent(){
        String template = "";
        final SimpleDateFormat iCalDate = new SimpleDateFormat("yyyyMMdd'T'HHmm'00'");  //TODO add timeZone handling
        URL url = Resources.getResource("email/event_template.ics");
        try {
            template = Resources.toString(url, Charsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return template.replace("{{organizer}}", parseOrganizer())
                .replace("{{attendees}}", parseAttendees())
                .replace("{{dtstart}}", iCalDate.format(start))
                .replace("{{dtend}}", iCalDate.format(end))
                .replace("{{dtstamp}}", iCalDate.format(new Date()));
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
        for (Persons interviewer : interviewers) {
            result += attendeeTemplate
                    .replace("{{fname}}", interviewer.getFirstName())
                    .replace("{{lname}}", interviewer.getLastName())
                    .replace("{{mail}}", interviewer.getEmail());
        }

        return result;
    }

}
