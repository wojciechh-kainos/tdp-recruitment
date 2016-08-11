package resources;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourcesFindPairsBetweenThreePersonsTest {

    private final String startDate = "01-01-2016";
    private final String endDate = "02-01-2016";
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private PairResource resource;
    private List<Slots> mockSlots;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {

        Calendar calendar = Calendar.getInstance();
        Date fistDate = new Date(calendar.getTimeInMillis());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date secondDate = new Date(calendar.getTimeInMillis());
        mockSlots = new ArrayList<>();

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, "available");
        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotTime((long) 1, new Time(8, 0, 0), new Time(8, 30, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotTime((long) 2, new Time(8, 30, 0), new Time(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, new Time(9, 0, 0), new Time(9, 30, 0));
        SlotsTimes sameSlotsTimeFourth = MockDataUtil.createSlotTime((long) 4, new Time(9, 30, 0), new Time(10, 00, 0));
        SlotsTimes sameSlotsTimeFifth = MockDataUtil.createSlotTime((long) 5, new Time(10, 0, 0), new Time(10, 30, 0));

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimesFirst, firstPerson, fistDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimesSecond, firstPerson, fistDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird, firstPerson, fistDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimesFirst, secondPerson, fistDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimesSecond, secondPerson, fistDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeThird, secondPerson, fistDate, availabilityType));

        mockSlots.add(MockDataUtil.createSlot((long)7, sameSlotsTimeThird, secondPerson, secondDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)8, sameSlotsTimeFourth, secondPerson, secondDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)9, sameSlotsTimeFifth, secondPerson, secondDate, availabilityType));

        Persons thirdPerson = MockDataUtil.createPersons((long)3, "THIRD", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)10, sameSlotsTimeThird, thirdPerson, secondDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)11, sameSlotsTimeFourth, thirdPerson, secondDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)12, sameSlotsTimeFifth, thirdPerson, secondDate, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindTwoDifferentPairsForWeek() {

        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Pair> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("Two pairs should be found", 2, pairs.size());

        Pair firstPair = pairs.get(0);
        assertEquals("First pair should have 3 elements", 3, firstPair.getSlots().size());

        Pair secondPair = pairs.get(1);
        assertEquals("First pair should have 3 elements", 3, secondPair.getSlots().size());
    }

}
