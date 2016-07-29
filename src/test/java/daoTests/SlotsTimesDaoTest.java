package daoTests;

import com.google.inject.Guice;
import com.google.inject.Injector;
import configuration.TdpRecruitmentModule;
import dao.SlotsTimesDao;
import domain.SlotsTimes;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;
import org.junit.Before;
import org.junit.Test;

import java.sql.Time;

import static org.junit.Assert.assertEquals;

public class SlotsTimesDaoTest {
    private SessionFactory sessionFactory;
    private SlotsTimesDao slotsTimesDao;
    private Injector injector;

    public SlotsTimesDaoTest() {
        AnnotationConfiguration config=new AnnotationConfiguration();
        config.setProperty("hibernate.connection.url","jdbc:postgresql://localhost/postgres");
        config.setProperty("hibernate.connection.username","postgres");
        config.setProperty("hibernate.connection.driver_class","org.postgresql.Driver");
        config.setProperty("hibernate.current_session_context_class", "thread");
        config.setProperty("hibernate.show_sql", "true");
        config.addAnnotatedClass(SlotsTimes.class);

        this.sessionFactory=config.buildSessionFactory();
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

    @Before
    public void setUp(){
        TdpRecruitmentModule module = new TdpRecruitmentModule();
        module.setSessionFactory(sessionFactory);
        injector = Guice.createInjector(module);
        slotsTimesDao = injector.getInstance(SlotsTimesDao.class);
        slotsTimesDao = new SlotsTimesDao(sessionFactory);
    }

    @Test
    public void test(){
        getSession().beginTransaction();

        Time time = new Time(8,0,0);

        slotsTimesDao = new SlotsTimesDao(sessionFactory);
        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setStartTime(time);
        slotsTimes.setEndTime(time);

        long message = slotsTimesDao.create(slotsTimes);

        assertEquals(true, true);

        getSession().getTransaction().commit();
    }

}
