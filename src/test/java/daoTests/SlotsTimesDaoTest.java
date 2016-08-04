package daoTests;

import databaseHelper.BaseTest;
import domain.SlotsTimes;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.Time;

import static org.junit.Assert.assertEquals;

@Ignore
public class SlotsTimesDaoTest extends BaseTest{

    @Test
    public void getSlotsTimeTest(){
        getSession().beginTransaction();

        SlotsTimes firstSlotTimeFromDb = slotsTimesDao.getById(1);

        assertEquals("First slotTime from db should start at correct time",
                firstSlotTimeFromDb.getStartTime(), new Time(8,0,0) );
        assertEquals("First slotTime from db should end at correct time",
                firstSlotTimeFromDb.getEndTime(), new Time(8,30,0) );

        getSession().getTransaction().commit();
    }

}
