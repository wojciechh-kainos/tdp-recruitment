package resources;

import com.google.inject.Inject;
import dao.PersonDao;
import domain.Person;
import io.dropwizard.hibernate.UnitOfWork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.Interview;
import services.MailService;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("/schedule")
public class ScheduleResource {

    private MailService mailService;
    private PersonDao personDao;
    private static final Logger logger = LoggerFactory.getLogger(ScheduleResource.class);

    @Inject
    public ScheduleResource(MailService mailService, PersonDao personDao) {
        this.mailService = mailService;
        this.personDao = personDao;
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response scheduleInterview(Interview interview) {
        List<Person> recruiters = personDao.findAllRecruiters();

        try {
            Message msg = interview.createMessage();
            for (Person recruiter : recruiters) {
                try {
                    if (!recruiter.getEmail().equals(interview.getOrganizer().getEmail())) {
                        msg.addRecipient(Message.RecipientType.CC, new InternetAddress(recruiter.getEmail()));
                    }
                } catch (AddressException e) {
                    logger.warn("Address parsing error  => {}", e.getMessage());
                }
            }
            mailService.sendEmail(msg);
        } catch (MessagingException e) {
            logger.warn("Mailing error  => {}", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        return Response.status(Response.Status.OK).build();
    }

}
