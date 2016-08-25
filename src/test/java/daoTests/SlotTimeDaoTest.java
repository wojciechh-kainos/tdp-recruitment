package daoTests;

import databaseHelper.BaseTest;
import domain.SlotTime;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.Time;

import static org.junit.Assert.assertEquals;

@Ignore
public class SlotTimeDaoTest extends BaseTest{

    @Test
    public void getSlotsTimeTest(){
        getSession().beginTransaction();

        SlotTime firstSlotTimeFromDb = slotTimeDao.getById(1).get();

        assertEquals("First slotTime from db should start at correct time",
                firstSlotTimeFromDb.getStartTime(), new Time(8,0,0) );
        assertEquals("First slotTime from db should end at correct time",
                firstSlotTimeFromDb.getEndTime(), new Time(8,30,0) );

        getSession().getTransaction().commit();
    }

}
