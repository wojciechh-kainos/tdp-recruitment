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


    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;
    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();
    private List<SlotsTimes> expectedFirstPairSlotsTimes, expectedSecondPairSlotsTimes, expectedThirdPairSlotsTimes;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {
        int TODAY_OFFSET = 0;
        Date firstDate = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date secondDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(firstDate);
        endDate = MockDataUtil.convertDateToString(secondDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        expectedFirstPairSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);
        expectedSecondPairSlotsTimes = MockDataUtil.createSlotsTimesList(1, 5);
        expectedThirdPairSlotsTimes = MockDataUtil.createSlotsTimesList(3, 5);


        Persons firstPerson = MockDataUtil.createPersons((long) 1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedFirstPairSlotsTimes, firstPerson, firstDate, availabilityType));
        Persons secondPerson = MockDataUtil.createPersons((long) 2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedFirstPairSlotsTimes, secondPerson, firstDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSecondPairSlotsTimes, secondPerson, secondDate, availabilityType));
        Persons thirdPerson = MockDataUtil.createPersons((long) 3, "THIRD", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSecondPairSlotsTimes, thirdPerson, secondDate, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindTwoDifferentPairsForWeek() {
        when(mockDao.findSlotsForPairMatching(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Persons> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);
        Persons firstPair = pairs.get(0);
        Persons secondPair = pairs.get(1);
        Persons thirdPair = pairs.get(2);

        assertEquals("Two pairs should be found", 3, pairs.size());
        assertEquals("First person should have 3 slot elements", 3, firstPair.getSlotsList().size());
        assertEquals("First person should have slots with one day only",
                firstPair
                        .getSlotsList()
                        .stream()
                        .map(Slots::getSlotsDate)
                        .distinct()
                        .count(), 1L);
        assertTrue("First person should have slots with expected slotsTimes",
                firstPair
                        .getSlotsList()
                        .stream()
                        .map(Slots::getSlot)
                        .allMatch(searchedSlotTime -> expectedFirstPairSlotsTimes.contains(searchedSlotTime)));

        assertEquals("Second person should have 8 slot elements", 8, secondPair.getSlotsList().size());
        assertEquals("Second person should have slots with two different days",
                secondPair
                        .getSlotsList()
                        .stream()
                        .map(Slots::getSlotsDate)
                        .distinct()
                        .count(), 2L);

        assertEquals("Third person should have 3 slot elements", 5, thirdPair.getSlotsList().size());
        assertEquals("Third person should have slots with one day only",
                thirdPair
                        .getSlotsList()
                        .stream()
                        .map(Slots::getSlotsDate)
                        .distinct()
                        .count(), 1L);
    }
}
