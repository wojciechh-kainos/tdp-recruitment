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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsInUnorderedSlots {

    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp(){
        Calendar calendar = Calendar.getInstance();
        Date date = new Date(calendar.getTimeInMillis());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date nextDate = new Date(calendar.getTimeInMillis());

        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        startDate = dateFormat.format(date);
        endDate = dateFormat.format(nextDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 5, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotsTimes sameSlotsTimeFourth = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 30, 0), LocalTime.of(10, 0, 0));
        SlotsTimes sameSlotsTimeFifth = MockDataUtil.createSlotTime((long) 9, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        SlotsTimes sameSlotsTimeSixth = MockDataUtil.createSlotTime((long) 7, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        SlotsTimes sameSlotsTimeSeventh = MockDataUtil.createSlotTime((long) 8, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimesFirst  , firstPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimesSecond , firstPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird   , firstPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimeFourth  , firstPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimeFifth   , firstPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeSixth   , firstPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)7, sameSlotsTimeSeventh , firstPerson, date, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)8, sameSlotsTimesFirst  , secondPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)9, sameSlotsTimesSecond , secondPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)10, sameSlotsTimeThird   , secondPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)11, sameSlotsTimeFourth  , secondPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)12, sameSlotsTimeFifth   , secondPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)13, sameSlotsTimeSixth   , secondPerson, date, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)14, sameSlotsTimeSeventh , secondPerson, date, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairForWeek(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Pair> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 1, pairs.size());

        Pair pair = pairs.get(0);
        assertEquals("Pair should have 6 elements", 6, pair.getSlots().size());
    }
}
