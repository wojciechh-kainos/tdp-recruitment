package databaseHelper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.Resources;
import configuration.TdpRecruitmentApplicationConfiguration;
import domain.AvailabilityTypes;
import domain.Persons;
import domain.SlotsTimes;
import io.dropwizard.configuration.ConfigurationFactory;
import io.dropwizard.db.DataSourceFactory;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.junit.BeforeClass;


/**
 * Created by malgorzatas on 29/07/16.
 */
public class BaseTest {

    protected static SessionFactory sessionFactory;
    private static ServiceRegistry serviceRegistry;

    @BeforeClass
    public static void createInjector() throws Exception {

        Configuration config = new Configuration();
        DataSourceFactory dbConfig = DatabaseConfigurationHelper.getDatabaseConfiguration();
        config.setProperty("hibernate.connection.url",dbConfig.getUrl());
        config.setProperty("hibernate.connection.username",dbConfig.getUser());
        config.setProperty("hibernate.connection.driver_class",dbConfig.getDriverClass());
        config.setProperty("hibernate.current_session_context_class", "thread");
        config.addAnnotatedClass(Persons.class);
        config.addAnnotatedClass(SlotsTimes.class);
        config.addAnnotatedClass(AvailabilityTypes.class);

        serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
                config.getProperties()).build();

        sessionFactory = config.buildSessionFactory(serviceRegistry);
    }

    public Session getSession()
    {
        Session session;
        try {
            session = sessionFactory.getCurrentSession();
        } catch (SessionException se) {
            session = sessionFactory.openSession();
        }

        return session;
    }

}
