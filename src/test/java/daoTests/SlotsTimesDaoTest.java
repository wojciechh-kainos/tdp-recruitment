package daoTests;

import com.google.inject.Guice;
import com.google.inject.Injector;
import configuration.TdpRecruitmentModule;
import dao.SlotsTimesDao;
import databaseHelper.BaseTest;
import domain.SlotsTimes;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Time;

import static org.junit.Assert.assertEquals;

public class SlotsTimesDaoTest extends BaseTest{
    private SlotsTimesDao slotsTimesDao;
    private SlotsTimes slotsTimes;

    @Before
    public void setUp(){
        slotsTimesDao = new SlotsTimesDao(sessionFactory);
    }

    @Test
    public void test(){
        getSession().beginTransaction();

        Time time = new Time(8,0,0);

        slotsTimesDao = new SlotsTimesDao(sessionFactory);
        slotsTimes = new SlotsTimes();
        slotsTimes.setStartTime(time);
        slotsTimes.setEndTime(time);

        long returnedId = slotsTimesDao.create(slotsTimes);

        SlotsTimes anotherSlotsTimes = slotsTimesDao.getById(returnedId);

        assertEquals("ReturnedId should be equal to added availabilityTypes id.", returnedId, anotherSlotsTimes.getId());

        getSession().getTransaction().commit();
    }

    @After
    public void tearDown(){
        getSession().beginTransaction();
        slotsTimesDao.delete(slotsTimes.getId());
        getSession().getTransaction().commit();
    }

}
