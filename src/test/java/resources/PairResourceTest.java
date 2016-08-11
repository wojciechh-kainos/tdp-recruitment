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
import java.util.*;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {

    private final String startDate = "01-01-2016";
    private final String endDate = "02-01-2016";
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;


    private AvailabilityTypes availabilityType;
    private PairResource resource;
    private List<Slots> mockSlots;
    private List<SlotsTimes> expectedSlotsTimes;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp(){
        Calendar calendar = Calendar.getInstance();
        Date sameDate = new Date(calendar.getTimeInMillis());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date differentDate = new Date(calendar.getTimeInMillis());
        mockSlots = new ArrayList<>();

        availabilityType = MockDataUtil.createAvailableType((long)1, "available");
        SlotsTimes sameSlotsTimeFirst = MockDataUtil.createSlotTime((long) 1, new Time(8, 0, 0), new Time(8, 30, 0));
        SlotsTimes sameSlotsTimeSecond = MockDataUtil.createSlotTime((long) 2, new Time(8, 30, 0), new Time(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, new Time(9, 0, 0), new Time(9, 30, 0));
        SlotsTimes differentSlotsTime = MockDataUtil.createSlotTime((long) 5, new Time(10, 0, 0), new Time(10, 30, 0));
        expectedSlotsTimes = Arrays.asList(sameSlotsTimeFirst,sameSlotsTimeSecond, sameSlotsTimeThird);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimeFirst, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimeSecond, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimeFirst, firstPerson, differentDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimeFirst, secondPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeSecond, secondPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)7, sameSlotsTimeThird, secondPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)8, differentSlotsTime, secondPerson, sameDate, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairs(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Pair> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        Pair pair = pairs.get(0);

        assertEquals("One pair of slots should be found", 1, pairs.size());

        assertEquals("Searched slots list should have three expected slot", 3, pair.getSlots().size());

        assertTrue("Searched slots should have the same slotsTime as expected", pair.getSlots().stream()
                                                                                                  .map(searchedSlot -> searchedSlot.getSlot())
                                                                                                    .allMatch(searchedSlotTime -> expectedSlotsTimes.contains(searchedSlotTime)));
    }

}
