package resourceTests.PairResourceTests;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;

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

public class PairResourceFindPairsForDifferentAvailabilityTypesTest {

    private final int TODAY_OFFSET = 0;
    private final int TOMORROW_OFFSET = 1;
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
        Date date = MockDataUtil.createDate(TODAY_OFFSET);
        Date nextDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(date);
        endDate = MockDataUtil.convertDateToString(nextDate);

        AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        AvailabilityTypes typeMaybe = MockDataUtil.createAvailableType((long) 5, AvailabilityTypesEnum.maybe);

        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimesFirst, firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimesSecond, firstPerson, date, typeAvailable));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird, firstPerson, date, typeAvailable));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimesFirst, secondPerson, date, typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimesSecond, secondPerson,  date, typeMaybe));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeThird, secondPerson, date, typeMaybe));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypes(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Pair> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 1, pairs.size());

        Pair pair = pairs.get(0);
        assertEquals("Pair should have 3 elements", 3, pair.getSlots().size());
    }
}
