package resources;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsForWeekTest {

    private final String startDate = "01-01-2016";
    private final String endDate = "02-01-2016";
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;

    private PairResource resource;
    private List<Slots> mockSlots;
    private AvailabilityTypes availabilityType;
    private List<SlotsTimes> expectedSlotsTimes;

    @Mock
    private static SlotsDao mockDao;
    private Date expectedDate;

    @Before
    public void setUp(){
        Calendar calendar = Calendar.getInstance();
        expectedDate = new Date(calendar.getTimeInMillis());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date differentDate = new Date(calendar.getTimeInMillis());
        mockSlots = new ArrayList<>();

        availabilityType = MockDataUtil.createAvailableType((long)1, "available");
        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotsTimes sameSlotsTimeFourth = MockDataUtil.createSlotTime((long) 4, LocalTime.of(9, 30, 0), LocalTime.of(10, 00, 0));
        SlotsTimes sameSlotsTimeFifth = MockDataUtil.createSlotTime((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        expectedSlotsTimes = Arrays.asList(sameSlotsTimesFirst,sameSlotsTimesSecond, sameSlotsTimeThird);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimesFirst, firstPerson, expectedDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimesSecond, firstPerson, expectedDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird, firstPerson, expectedDate, availabilityType));

        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimeFourth, firstPerson, differentDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimeFifth, firstPerson, differentDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimesFirst, secondPerson, expectedDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)7, sameSlotsTimesSecond, secondPerson, expectedDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)8, sameSlotsTimeThird, secondPerson, expectedDate, availabilityType));

        mockSlots.add(MockDataUtil.createSlot((long)9, sameSlotsTimeThird, secondPerson, differentDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)10, sameSlotsTimeFourth, secondPerson, differentDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)11, sameSlotsTimeFifth, secondPerson, differentDate, availabilityType));

        resource = new PairResource(mockDao);
    }


    @Test
    public void testFindPairForWeek(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Pair> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 1, pairs.size());

        Pair pair = pairs.get(0);
        assertEquals("Pair should have 3 elements", 3, pair.getSlots().size());

        assertTrue("When two people has sames slots in different days only these with minimum 3 slots times should be shown",
                                    pair.getSlots().stream()
                                        .map(searchedSlot -> searchedSlot.getSlot())
                                        .allMatch(searchedSlotTime -> expectedSlotsTimes.contains(searchedSlotTime)));

        assertTrue("Found slots should be at expected day", pair.getSlots().stream().allMatch(slot -> slot.getSlotsDate().equals(expectedDate)));

    }



}
