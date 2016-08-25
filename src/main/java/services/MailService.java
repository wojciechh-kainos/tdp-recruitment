package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentEmailConfiguration;

import javax.mail.Message;
import java.util.concurrent.ExecutorService;

public class MailService {

    private final ExecutorService executor;

    private final TdpRecruitmentEmailConfiguration emailConfiguration;

    @Inject
    public MailService(TdpRecruitmentEmailConfiguration config, ExecutorService executor) {
        this.emailConfiguration = config;
        this.executor = executor;
    }
    
    public void sendEmail(Message message) {
        MailingTask mailingTask = new MailingTask(emailConfiguration, message);
        executor.execute(mailingTask);
    }

}
