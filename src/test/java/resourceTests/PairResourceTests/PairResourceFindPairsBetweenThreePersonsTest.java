package resourceTests.PairResourceTests;

import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsBetweenThreePersonsTest {

    private final AvailabilityType availabilityType = MockDataUtil.available;

    private List<Slot> mockSlots = new ArrayList<>();
    private List<SlotTime> expectedFirstPersonSlotsTimes, expectedSecondPersonSlotsTimes;
    private List<Person> persons;

    @Before
    public void setUp() {
        expectedFirstPersonSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);
        expectedSecondPersonSlotsTimes = MockDataUtil.createSlotsTimesList(1, 5);

        mockSlots.addAll(slotsForFirstPerson(1L, MockDataUtil.today));
        mockSlots.addAll(slotsForSecondPerson());
        mockSlots.addAll(slotsForFirstPerson(3L, MockDataUtil.tomorrow));

        persons = MockDataUtil.findPairs(mockSlots);
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnThreePersons() {
        assertEquals("Three people should be found", 3, persons.size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnThreeSlotsForFirstPerson() {
        Person firstPair = persons.get(0);

        assertEquals("First person should have 3 slot elements", 3, firstPair.getSlotList().size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsInOneDayForFirstPerson() {
        Person firstPair = persons.get(0);

        assertEquals("First person should have slots with one day only",
                firstPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotDate)
                        .distinct()
                        .count(), 1L);
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsWithExpectedSlotsTimes() {
        Person firstPair = persons.get(0);

        assertTrue("First person should have slots with expected slotsTimes",
                firstPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotTime)
                        .allMatch(searchedSlotTime -> expectedFirstPersonSlotsTimes.contains(searchedSlotTime)));
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnEightSlotsForSecondPerson() {
        Person secondPair = persons.get(1);

        assertEquals("Second person should have 8 slot elements", 8, secondPair.getSlotList().size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsInTwoDaysForSecondPerson() {
        Person secondPair = persons.get(1);

        assertEquals("Second person should have slots with two different days",
                secondPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotDate)
                        .distinct()
                        .count(), 2L);
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnFiveSlotsForThirdPerson() {
        Person thirdPair = persons.get(2);

        assertEquals("Third person should have 5 slot elements", 5, thirdPair.getSlotList().size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsInOneDayForThirdPerson() {
        Person thirdPair = persons.get(2);

        assertEquals("Third person should have slots with one day only",
                thirdPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotDate)
                        .distinct()
                        .count(), 1L);
    }

    private List<Slot> slotsForFirstPerson(Long personId, Date date){
        Person person = MockDataUtil.createPerson(personId);

        return MockDataUtil.createSlotsToSlotTimes(expectedFirstPersonSlotsTimes, person, date, availabilityType);
    }

    private List<Slot> slotsForSecondPerson(){
        List<Slot> slots = new ArrayList<>();
        Person person = MockDataUtil.createPerson(2L);
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedFirstPersonSlotsTimes, person, MockDataUtil.today, availabilityType));
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSecondPersonSlotsTimes, person, MockDataUtil.tomorrow, availabilityType));

        return slots;
    }
}
