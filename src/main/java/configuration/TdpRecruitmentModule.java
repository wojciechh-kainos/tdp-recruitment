package configuration;


import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.ProvisionException;
import org.hibernate.SessionFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TdpRecruitmentModule extends AbstractModule {

    private SessionFactory sessionFactory;

    private ExecutorService executorService;

    @Provides
    SessionFactory providesSessionFactory() {

        if (sessionFactory == null) {
            throw new ProvisionException("The Hibernate session factory has not yet been set. This is likely caused by forgetting to call setSessionFactory during Application.run()");
        }

        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Provides
    ExecutorService providesExecutorService(TdpRecruitmentApplicationConfiguration config) {
        if (executorService == null) {
            synchronized (this) {
                if (executorService == null) {
                    executorService = Executors.newFixedThreadPool(config.getThreadPoolSize());
                }
            }
        }

        return executorService;
    }

    @Override
    protected void configure() {
    }
}
