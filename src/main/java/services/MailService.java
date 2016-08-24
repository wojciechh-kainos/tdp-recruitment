package services;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import configuration.TdpRecruitmentApplicationConfiguration;

import javax.mail.Message;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Singleton
public class MailService {

    private final ExecutorService pool;

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config) {
        this.applicationConfiguration = config;
        this.pool = Executors.newFixedThreadPool(config.getSmtpConfig().getThreadPool());
    }


    public void sendEmail(Message message) {
        MailingTask mailingTask = new MailingTask(applicationConfiguration);
        pool.execute(mailingTask.sendMessage(message));
    }

}
