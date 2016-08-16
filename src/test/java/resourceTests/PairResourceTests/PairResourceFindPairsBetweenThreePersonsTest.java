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
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsBetweenThreePersonsTest {


    private final int TODAY_OFFSET = 0;
    private final int TOMORROW_OFFSET = 1;
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

        Date firstDate = MockDataUtil.createDate(TODAY_OFFSET);
        Date secondDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(firstDate);
        endDate = MockDataUtil.convertDateToString(secondDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        expectedFirstPairSlotsTimes = MockDataUtil.createSlotsTimesList(1,3);
        expectedSecondPairSlotsTimes = MockDataUtil.createSlotsTimesList(3,5);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedFirstPairSlotsTimes, firstPerson, firstDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedFirstPairSlotsTimes, secondPerson, firstDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSecondPairSlotsTimes, secondPerson, secondDate, availabilityType));

        Persons thirdPerson = MockDataUtil.createPersons((long)3, "THIRD", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSecondPairSlotsTimes, thirdPerson, secondDate, availabilityType));

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
