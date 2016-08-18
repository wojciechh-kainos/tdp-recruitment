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
import java.util.*;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {

    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();
    private List<SlotsTimes> expectedSlotsTimes;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {
        int TODAY_OFFSET = 0;
        int TOMORROW_OFFSET = 1;
        Date sameDate = MockDataUtil.createDate(TODAY_OFFSET);
        Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(sameDate);
        endDate = MockDataUtil.convertDateToString(differentDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        List<SlotsTimes> differentSlotsTime = MockDataUtil.createSlotsTimesList(5, 5);
        expectedSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);

        Persons firstPerson = MockDataUtil.createPersons((long) 1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSlotsTimes, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot(expectedSlotsTimes.get(0), firstPerson, differentDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long) 2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSlotsTimes, secondPerson, sameDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(differentSlotsTime, secondPerson, sameDate, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairs() {
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Persons> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);
        Persons pair = pairs.get(0);

        assertEquals("Should find 2 persons with pairs", 2, pairs.size());
        assertEquals("First person should have 3 slots in slotsList", 3, pair.getSlotsList().size());
        assertTrue("SlotsTimes of all paired persons should be equal to expectedSlotsTimes",
                pair
                        .getSlotsList()
                        .stream()
                        .map(Slots::getSlot)
                        .allMatch(searchedSlotTime -> expectedSlotsTimes.contains(searchedSlotTime)));
    }
}
