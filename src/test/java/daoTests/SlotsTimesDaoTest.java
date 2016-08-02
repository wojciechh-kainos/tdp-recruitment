package daoTests;

import dao.SlotsTimesDao;
import databaseHelper.BaseTest;
import domain.SlotsTimes;
import org.junit.Before;
import org.junit.Test;

import java.sql.Time;

import static org.junit.Assert.assertEquals;

public class SlotsTimesDaoTest extends BaseTest{

    private SlotsTimesDao slotsTimesDao;

    @Before
    public void setUp(){
        slotsTimesDao = new SlotsTimesDao(sessionFactory);
    }

    @Test
    public void test(){
        getSession().beginTransaction();

        SlotsTimes firstSlotTimeFromDb = slotsTimesDao.getById(1);

        assertEquals("First slotTime from db should start at correct time",
                firstSlotTimeFromDb.getStartTime(), new Time(8,0,0) );
        assertEquals("First slotTime from db should end at correct time",
                firstSlotTimeFromDb.getEndTime(), new Time(8,30,0) );

        getSession().getTransaction().commit();
    }

}
