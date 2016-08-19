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

    private List<Slots> mockSlots = new ArrayList<>();
    private List<SlotsTimes> expectedSameSlotsTimes;
    private List<Persons> persons;
    private Date expectedDate;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {
        String startDate;
        String endDate;
        final Boolean isDev = true;
        final Boolean isTest = false;
        final Boolean isOps = false;
        PairResource resource;
        int TODAY_OFFSET = 0;
        expectedDate = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(expectedDate);
        endDate = MockDataUtil.convertDateToString(differentDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);
        List<SlotsTimes> threeDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(3, 5);
        List<SlotsTimes> twoDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(4, 5);

        Persons firstPerson = MockDataUtil.createPersons((long) 1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, firstPerson, expectedDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(twoDifferentSlotsTimes, firstPerson, differentDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long) 2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, secondPerson, expectedDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(threeDifferentSlotsTimes, secondPerson, differentDate, availabilityType));

        resource = new PairResource(mockDao);

        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, isDev, isTest, isOps);
    }


    @Test
    public void testFindPairForWeekShouldFindTwoPersons() {
        assertEquals("Should find 2 persons with pairs", 2, persons.size());
    }

    @Test
    public void testFindPairForWeekEachPersonShouldHaveThreeSlots() {
        assertTrue("Every person should have 3 slots in slotsList",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotsList().size() == 3));

    }

    @Test
    public void testFindPairForWeekFoundSlotsShouldBeTheSameAsExpected() {
        Persons firstPerson = persons.get(0);

        assertTrue("When two people has the same slots in different days only these with minimum 3 slots times should be shown",
                firstPerson
                        .getSlotsList()
                        .stream()
                        .map(Slots::getSlot)
                        .allMatch(searchedSlotTime -> expectedSameSlotsTimes.contains(searchedSlotTime)));
    }

    @Test
    public void testFindPairForWeekFoundSlotsShouldBeAtExpectedDay() {
        Persons firstPerson = persons.get(0);

        assertTrue("Found slots should be at expected day",
                firstPerson
                        .getSlotsList()
                        .stream()
                        .allMatch(slot -> slot.getSlotsDate().equals(expectedDate)));

    }
}
