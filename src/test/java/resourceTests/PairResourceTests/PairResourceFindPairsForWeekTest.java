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
public class PairResourceFindPairsForWeekTest {

    private final int TODAY_OFFSET = 0;
    private final int TOMORROW_OFFSET = 1;
    private String startDate;
    private String endDate;
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();
    private List<SlotsTimes> expectedSameSlotsTimes;

    @Mock
    private static SlotsDao mockDao;
    private Date expectedDate;

    @Before
    public void setUp(){
        expectedDate = MockDataUtil.createDate(TODAY_OFFSET);
        Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(expectedDate);
        endDate = MockDataUtil.convertDateToString(differentDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1,3);
        List<SlotsTimes> threeDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(3,5);
        List<SlotsTimes> twoDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(4,5);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, firstPerson, expectedDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(twoDifferentSlotsTimes, firstPerson, differentDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, secondPerson, expectedDate, availabilityType));

        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(threeDifferentSlotsTimes, secondPerson, differentDate, availabilityType));

        resource = new PairResource(mockDao);
    }


    @Test
    public void testFindPairForWeek(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Pair> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 1, pairs.size());

        Pair pair = pairs.get(0);
        assertEquals("Pair should have 3 slots", 3, pair.getSlots().size());

        assertTrue("When two people has the same slots in different days only these with minimum 3 slots times should be shown",
                                    pair.getSlots().stream()
                                        .map(searchedSlot -> searchedSlot.getSlot())
                                        .allMatch(searchedSlotTime -> expectedSameSlotsTimes.contains(searchedSlotTime)));

        assertTrue("Found slots should be at expected day", pair.getSlots().stream().allMatch(slot -> slot.getSlotsDate().equals(expectedDate)));

    }



}
