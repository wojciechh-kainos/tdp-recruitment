package databaseHelper;

import dao.AvailabilityTypesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import dao.SlotsTimesDao;
import domain.AvailabilityTypes;
import domain.Persons;
import domain.Slots;
import domain.SlotsTimes;
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
    protected static PersonsDao personsDao;
    protected static SlotsDao slotsDao;
    protected static SlotsTimesDao slotsTimesDao;
    protected static AvailabilityTypesDao availabilityTypesDao;

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
        config.addAnnotatedClass(Slots.class);

        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
                config.getProperties()).build();

        sessionFactory = config.buildSessionFactory(serviceRegistry);
    }

    @BeforeClass
    public static void createDao(){
        personsDao = new PersonsDao(sessionFactory);
        slotsDao = new SlotsDao(sessionFactory);
        slotsTimesDao = new SlotsTimesDao(sessionFactory);
        availabilityTypesDao = new AvailabilityTypesDao(sessionFactory);
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

    protected SlotsTimes getSlotTimeFromDb(Long id) {

        getSession().beginTransaction();
        SlotsTimes slotsTimeFromDb = slotsTimesDao.getById(id);
        getSession().getTransaction().commit();

        return slotsTimeFromDb;
    }

    protected AvailabilityTypes getAvailabilityTypeFromDb(Long id) {

        getSession().beginTransaction();
        AvailabilityTypes availabilityTypeFromDb = availabilityTypesDao.getById(id);
        getSession().getTransaction().commit();

        return availabilityTypeFromDb;
    }

}
