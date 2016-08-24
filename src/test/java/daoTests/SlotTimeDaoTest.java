package daoTests;

import databaseHelper.BaseTest;
import domain.SlotTime;
import liquibase.exception.LiquibaseException;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.Time;

import static org.junit.Assert.assertEquals;

@Ignore
public class SlotTimeDaoTest extends BaseTest{

    @Test
    public void getSlotsTimeTest() throws LiquibaseException {
        getSession().beginTransaction();

        SlotTime firstSlotTimeFromDb = slotTimeDao.getById(1);

        assertEquals("First slotTime from db should start at correct time",
                firstSlotTimeFromDb.getStartTime(), new Time(8,0,0) );
        assertEquals("First slotTime from db should end at correct time",
                firstSlotTimeFromDb.getEndTime(), new Time(8,30,0) );

        getSession().getTransaction().commit();
    }

}
