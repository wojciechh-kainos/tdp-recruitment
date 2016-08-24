package databaseHelper;

import dao.AvailabilityTypeDao;
import dao.PersonDao;
import dao.SlotDao;
import dao.SlotTimeDao;
import domain.*;
import io.dropwizard.db.DataSourceFactory;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseConnection;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.HsqlConnection;
import liquibase.exception.DatabaseException;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.jdbc.ReturningWork;
import org.hibernate.service.ServiceRegistry;
import org.junit.BeforeClass;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class BaseTest {

    private static SessionFactory sessionFactory;
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
    }

    public Session getSession() throws LiquibaseException {
        Session session;
        try {
            session = sessionFactory.getCurrentSession();
        } catch (SessionException se) {
            session = sessionFactory.openSession();
        }

        return session;
    }

    protected SlotTime getSlotTimeFromDb(Long id) throws LiquibaseException {

        getSession().beginTransaction();
        SlotTime slotsTimeFromDb = slotTimeDao.getById(id);
        getSession().getTransaction().commit();

        return slotsTimeFromDb;
    }

    protected AvailabilityType getAvailabilityTypeFromDb(Long id) throws LiquibaseException {

        getSession().beginTransaction();
        AvailabilityType availabilityTypeFromDb = availabilityTypeDao.getById(id);
        getSession().getTransaction().commit();

        return availabilityTypeFromDb;
    }

}
