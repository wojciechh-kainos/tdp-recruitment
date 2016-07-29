package Resources;



import configuration.TdpRecruitmentEmailConfiguration;
import org.codemonkey.simplejavamail.Mailer;
import org.codemonkey.simplejavamail.TransportStrategy;
import org.codemonkey.simplejavamail.email.Email;

import javax.mail.Message;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * Created by remigiuszk on 29/07/16.
 */
@Path("/home")
public class EmailResource {

    private final TdpRecruitmentEmailConfiguration config;

    public EmailResource(TdpRecruitmentEmailConfiguration config){
        this.config = config;
    }


    @Path("/sendEmail")
    @GET
    public Response sendEmail() {
        final Email email = new Email();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();
        String pass = config.getPassword();
        String[] to = {"test@test.com"};

        email.setFromAddress("", from);
        email.setSubject("Test email");
        for( int i=0; i < to.length; i++ ) {
            email.addRecipient("", to[i], Message.RecipientType.TO);
        }
        email.setText("Testing e-mails");

        try {
            new Mailer(host, port, from, pass, TransportStrategy.SMTP_TLS).sendMail(email);
        }catch(Exception e){
            return Response.status(Response.Status.CONFLICT).build();
        }
        return Response.status(Response.Status.OK).build();

    }
}
