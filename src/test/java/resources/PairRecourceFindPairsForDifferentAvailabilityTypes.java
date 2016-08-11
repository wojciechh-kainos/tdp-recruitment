package resources;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)

public class PairRecourceFindPairsForDifferentAvailabilityTypes {

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

        AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        AvailabilityTypes typeMaybe = MockDataUtil.createAvailableType((long) 5, AvailabilityTypesEnum.maybe);


        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotsTimes sameSlotsTimeFourth = MockDataUtil.createSlotTime((long) 6, LocalTime.of(10, 30, 0), LocalTime.of(11, 0, 0));
        SlotsTimes sameSlotsTimeFifth = MockDataUtil.createSlotTime((long) 7, LocalTime.of(11, 30, 0), LocalTime.of(12, 0, 0));
        SlotsTimes sameSlotsTimeSixth = MockDataUtil.createSlotTime((long) 8, LocalTime.of(12, 30, 0), LocalTime.of(13, 0, 0));
        SlotsTimes sameSlotsTimeSeventh = MockDataUtil.createSlotTime((long) 9, LocalTime.of(13, 30, 0), LocalTime.of(14, 0, 0));

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimesFirst  , firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimesSecond , firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird   , firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimeFourth  , firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimeFifth   , firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeSixth   , firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)7, sameSlotsTimeSeventh , firstPerson, date, typeAvailable));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)8, sameSlotsTimesFirst  , secondPerson, date, typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)9, sameSlotsTimesSecond , secondPerson,  date, typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)10, sameSlotsTimeThird   , secondPerson, date,typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)11, sameSlotsTimeFourth  , secondPerson, date,typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)12, sameSlotsTimeFifth   , secondPerson, date,typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)13, sameSlotsTimeSixth   , secondPerson, date,typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)14, sameSlotsTimeSeventh , secondPerson, date,typeMaybe));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypes(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Pair> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 1, pairs.size());

        Pair pair = pairs.get(0);
        assertEquals("Pair should have 7 elements", 7, pair.getSlots().size());
    }
}
