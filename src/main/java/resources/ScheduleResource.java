package resources;

import com.google.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.Interview;
import services.MailService;

import javax.mail.MessagingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/schedule")
public class ScheduleResource {

    private MailService mailService;
 	private static final Logger logger = LoggerFactory.getLogger(ScheduleResource.class);

    @Inject
    public ScheduleResource(MailService mailService) {
        this.mailService = mailService;
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response scheduleInterview(Interview interview) {
        try {
            mailService.sendEmail(interview.createMessage());
        } catch (MessagingException e) {
            logger.warn("Mailing error  => {}", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        return Response.status(Response.Status.OK).build();
    }

}
