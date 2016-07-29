package databaseHelper;

import com.google.inject.Guice;
import com.google.inject.Injector;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentModule;
import dao.AvailabilityTypesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import dao.SlotsTimesDao;
import domain.Persons;
import domain.Slots;
import domain.SlotsTimes;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.AnnotationConfiguration;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;
import org.junit.BeforeClass;

/**
 * Created by malgorzatas on 29/07/16.
 */
public class BaseTest {

    protected static Injector injector;
    protected static SessionFactory sessionFactory;

    private static ServiceRegistry serviceRegistry;
    protected static PersonsDao personsDao;
    protected static SlotsDao slotsDao;
    protected static SlotsTimesDao slotsTimesDao;
    protected static AvailabilityTypesDao availabilityTypesDao;

    @BeforeClass
    public static void createInjector() {

        Configuration config = new Configuration();
        config.setProperty("hibernate.connection.url","jdbc:postgresql://localhost/postgres");
        config.setProperty("hibernate.connection.username","postgres");
        config.setProperty("hibernate.connection.driver_class","org.postgresql.Driver");
        config.setProperty("hibernate.current_session_context_class", "thread");
        config.setProperty("hibernate.show_sql", "false");
        config.addAnnotatedClass(Persons.class);

        serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
                config.getProperties()).build();

        sessionFactory = config.buildSessionFactory(serviceRegistry);

        TdpRecruitmentModule module = new TdpRecruitmentModule();
        module.setSessionFactory(sessionFactory);
        injector = Guice.createInjector(module);
        personsDao = injector.getInstance(PersonsDao.class);
        slotsDao = injector.getInstance(SlotsDao.class);
        slotsTimesDao = injector.getInstance(SlotsTimesDao.class);
        availabilityTypesDao = injector.getInstance(AvailabilityTypesDao.class);
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
