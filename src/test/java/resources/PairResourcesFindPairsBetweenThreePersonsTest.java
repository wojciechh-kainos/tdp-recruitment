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
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourcesFindPairsBetweenThreePersonsTest {

    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;
    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();
    private List<SlotsTimes> expectedFirstPairSlotsTimes, expectedSecondPairSlotsTimes;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {

        Calendar calendar = Calendar.getInstance();
        Date firstDate = new Date(calendar.getTimeInMillis());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date secondDate = new Date(calendar.getTimeInMillis());

        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        startDate = dateFormat.format(firstDate);
        endDate = dateFormat.format(secondDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotsTimes sameSlotsTimeFourth = MockDataUtil.createSlotTime((long) 4, LocalTime.of(9, 30, 0), LocalTime.of(10, 0, 0));
        SlotsTimes sameSlotsTimeFifth = MockDataUtil.createSlotTime((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));

        expectedFirstPairSlotsTimes = Arrays.asList(sameSlotsTimesFirst, sameSlotsTimesSecond, sameSlotsTimeThird);
        expectedSecondPairSlotsTimes = Arrays.asList(sameSlotsTimeThird, sameSlotsTimeFourth, sameSlotsTimeFifth);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimesFirst, firstPerson, firstDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimesSecond, firstPerson, firstDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird, firstPerson, firstDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimesFirst, secondPerson, firstDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimesSecond, secondPerson, firstDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeThird, secondPerson, firstDate, availabilityType));

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
        assertTrue("First pair should have slots with expected slotsTimes",
                firstPair.getSlots().stream()
                        .map(searchedSlot -> searchedSlot.getSlot())
                        .allMatch(searchedSlotTime -> expectedFirstPairSlotsTimes.contains(searchedSlotTime)));


        Pair secondPair = pairs.get(1);
        assertEquals("Second pair should have 3 elements", 3, secondPair.getSlots().size());
        assertTrue("Second pair should have slots with expected slotsTimes",
                secondPair.getSlots().stream()
                        .map(searchedSlot -> searchedSlot.getSlot())
                        .allMatch(searchedSlotTime -> expectedSecondPairSlotsTimes.contains(searchedSlotTime)));

    }

}
