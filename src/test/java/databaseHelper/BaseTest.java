package databaseHelper;

import dao.*;
import domain.*;
import io.dropwizard.db.DataSourceFactory;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.junit.BeforeClass;

public class BaseTest {

    private static SessionFactory sessionFactory;
    protected static CandidateDao candidateDao;
    protected static PersonDao personDao;
    protected static SlotDao slotDao;
    protected static SlotTimeDao slotTimeDao;
    protected static AvailabilityTypeDao availabilityTypeDao;

    @BeforeClass
    public static void createInjector() throws Exception {

        Configuration config = new Configuration();
        DataSourceFactory dbConfig = DatabaseConfigurationHelper.getDatabaseConfiguration();
        config.setProperty("hibernate.connection.url",dbConfig.getUrl());
        config.setProperty("hibernate.connection.username",dbConfig.getUser());
        config.setProperty("hibernate.connection.password",dbConfig.getPassword());
        config.setProperty("hibernate.connection.driver_class",dbConfig.getDriverClass());
        config.setProperty("hibernate.current_session_context_class", "thread");
        config.addAnnotatedClass(Person.class);
        config.addAnnotatedClass(SlotTime.class);
        config.addAnnotatedClass(AvailabilityType.class);
        config.addAnnotatedClass(Slot.class);
        config.addAnnotatedClass(Candidate.class);
        config.addAnnotatedClass(Note.class);

        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
                config.getProperties()).build();

        sessionFactory = config.buildSessionFactory(serviceRegistry);
    }

    @BeforeClass
    public static void createDao(){
        personDao = new PersonDao(sessionFactory);
        slotDao = new SlotDao(sessionFactory);
        slotTimeDao = new SlotTimeDao(sessionFactory);
        availabilityTypeDao = new AvailabilityTypeDao(sessionFactory);
        candidateDao = new CandidateDao(sessionFactory);
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

    protected SlotTime getSlotTimeFromDb(Long id) {

        getSession().beginTransaction();
        SlotTime slotsTimeFromDb = slotTimeDao.getById(id).get();
        getSession().getTransaction().commit();

        return slotsTimeFromDb;
    }

    protected AvailabilityType getAvailabilityTypeFromDb(Long id) {

        getSession().beginTransaction();
        AvailabilityType availabilityTypeFromDb = availabilityTypeDao.getById(id).get();
        getSession().getTransaction().commit();

        return availabilityTypeFromDb;
    }

}
