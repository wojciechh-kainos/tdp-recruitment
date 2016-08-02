package configuration;


import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.ProvisionException;
import org.hibernate.SessionFactory;

public class TdpRecruitmentModule extends AbstractModule{

    private SessionFactory sessionFactory;

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

    @Override
    protected void configure() {

    }
}
